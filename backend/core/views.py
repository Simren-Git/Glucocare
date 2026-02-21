from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from .models import Appointment, Payment
from datetime import date, datetime, timedelta


import json

from .models import (
    Users,
    Doctor,
    Patient,
    BloodSugarRecord,
    DietPlan,
    TreatmentPlan,
    MedicalAdviceMessage,
)

from .serializers import PatientSerializer, BloodSugarRecordSerializer


# ================= AUTH =================
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = Users.objects.filter(email=email).first()
    if user and check_password(password, user.password_hash):
        return Response({
            "status": "success",
            "user_id": user.user_id,
            "role": user.role
        })

    return Response({"error": "Invalid credentials"}, status=400)


# ================= DOCTOR =================
@api_view(['POST'])
def create_doctor(request):
    user = Users.objects.create(
        email=request.data['email'],
        password_hash=make_password(request.data['password']),
        role='doctor'
    )

    Doctor.objects.create(
        user=user,
        doctor_name=request.data['doctor_name'],
        specialization=request.data['specialization'],
        phone=request.data['phone'],
        hospital_name=request.data['hospital_name']
    )

    return Response({"message": "Doctor created"})


@api_view(['GET'])
def total_patients(request):
    return Response({"total": Patient.objects.count()})


@api_view(['GET'])
def recent_patients(request):
    patients = Patient.objects.order_by('-registered_at')[:5]
    data = []
    for p in patients:
        avg = BloodSugarRecord.objects.filter(
            patient=p
        ).aggregate(models.Avg('sugar_level'))['sugar_level__avg']

        hba1c = round((avg + 46.7) / 28.7, 1) if avg else None
        if hba1c is None:
            status_label = "unknown"
        elif hba1c < 5.7:
            status_label = "normal"
        elif hba1c < 6.5:
            status_label = "prediabetes"
        else:
            status_label = "high"

        data.append({
            "patient_id": p.patient_id,
            "name": p.patient_name,
            "age": p.age,
            "hba1c": hba1c,
            "status": status_label
        })

    return Response(data)


@api_view(['GET'])
def doctor_patients(request, doctor_user_id):
    doctor = Doctor.objects.get(user__user_id=doctor_user_id)
    patients = Patient.objects.filter(doctor=doctor)

    data = []
    for p in patients:
        avg = BloodSugarRecord.objects.filter(
            patient=p
        ).aggregate(models.Avg('sugar_level'))['sugar_level__avg']

        data.append({
            "patient_id": p.patient_id,
            "user_id": p.user.user_id,
            "name": p.patient_name,
            "age": p.age,
            "gender": p.gender,
            "avg_glucose": round(avg, 1) if avg else None
        })

    return Response(data)


# ================= PATIENT =================
@api_view(['POST'])
def register_patient(request):
    try:
        doctor = Doctor.objects.get(user__user_id=request.data['doctor_id'])

        email = request.data['email']
        password = request.data['password']
        patient_name = request.data['patient_name']

        # ✅ Prevent duplicate email
        if Users.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Create user
        user = Users.objects.create(
            email=email,
            password_hash=make_password(password),
            role='patient'
        )

        # ✅ Create patient
        Patient.objects.create(
            user=user,
            doctor=doctor,
            patient_name=patient_name,
            age=request.data['age'],
            gender=request.data['gender'],
            phone=request.data['phone']
        )

        # ✅ SEND EMAIL
        send_mail(
            subject="Your GlucoCare Patient Account",
            message=f"""
Hello {patient_name},

Your patient account has been created successfully.

Login Email: {email}
Temporary Password: {password}

Please login and change your password after first login.

Regards,
GlucoCare Team
""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"message": "Patient registered and email sent"},
            status=status.HTTP_201_CREATED
        )

    except Doctor.DoesNotExist:
        return Response(
            {"error": "Invalid doctor"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['GET'])
def patient_profile(request, user_id):
    # Support lookups by user_id (preferred) and patient_id (fallback)
    patient = Patient.objects.filter(user__user_id=user_id).first()
    if not patient:
        patient = Patient.objects.filter(patient_id=user_id).first()
    if not patient:
        return Response({"error": "Patient not found"}, status=404)
    return Response(PatientSerializer(patient).data)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Patient, BloodSugarRecord
from .serializers import BloodSugarRecordSerializer


# ================= ADD BLOOD SUGAR =================
@api_view(['POST'])
def add_blood_sugar(request):
    patient = get_object_or_404(
        Patient,
        user__user_id=request.data['user_id']
    )

    record = BloodSugarRecord.objects.create(
        patient=patient,
        sugar_level=request.data['sugar_level'],
        measurement_type=request.data.get('measurement_type'),
        food_item=request.data.get('food_item'),
        insulin_units=request.data.get('insulin_units'),
        date=request.data.get('date'),
        time=request.data.get('time')
    )

    return Response(
        BloodSugarRecordSerializer(record).data,
        status=201
    )


# ================= PATIENT HISTORY =================
@api_view(['GET'])
def blood_sugar_history(request, user_id):
    patient = get_object_or_404(Patient, user__user_id=user_id)

    records = BloodSugarRecord.objects.filter(
        patient=patient
    ).order_by('-recorded_at')

    return Response(
        BloodSugarRecordSerializer(records, many=True).data
    )


# ================= DOCTOR → GLUCOSE MANAGEMENT =================
@api_view(['GET'])
def get_blood_glucose_records(request, user_id):
    patient = get_object_or_404(Patient, user__user_id=user_id)

    records = BloodSugarRecord.objects.filter(
        patient=patient
    ).order_by('-recorded_at')

    return Response([
        {
            "id": r.record_id,
            "type": r.measurement_type,
            "glucose": r.sugar_level,
            "foodIntake": r.food_item,
            "insulinUnits": r.insulin_units,
            "insulinTaken": bool(r.insulin_units),
            "date": r.date,
            "time": r.time,
            "recorded_at": r.recorded_at,
            "notes": ""
        }
        for r in records
    ])

# ================= DIET PLANS =================
@api_view(['POST'])
def create_diet_plan(request):
    patient = Patient.objects.get(
        user__user_id=request.data['patient_id']
    )

    DietPlan.objects.create(
        patient=patient,
        doctor=patient.doctor,
        diet_details=json.dumps(request.data['diet_details'])
    )

    return Response(
        {"message": "Diet plan created"},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
def get_diet_plans(request, user_id):
    patient = Patient.objects.get(user__user_id=user_id)

    plans = DietPlan.objects.filter(
        patient=patient
    ).order_by('-created_at')

    return Response([
        {
            "diet_plan_id": p.diet_plan_id,
            "diet_details": json.loads(p.diet_details),
            "created_at": p.created_at
        }
        for p in plans
    ])


# ================= TREATMENT PLANS =================
@api_view(['POST'])
def create_treatment_plan(request):
    patient = Patient.objects.get(
        user__user_id=request.data['patient_id']
    )

    TreatmentPlan.objects.create(
        patient=patient,
        doctor=patient.doctor,
        treatment_details=json.dumps(
            request.data['treatment_details']
        ),
        start_date=request.data['start_date'],
        end_date=request.data['end_date']
    )

    return Response(
        {"message": "Treatment plan created"},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
def get_treatment_plans(request, user_id):
    patient = Patient.objects.get(user__user_id=user_id)

    plans = TreatmentPlan.objects.filter(
        patient=patient
    ).order_by('-created_at')

    return Response([
        {
            "treatment_id": p.treatment_id,
            "treatment_details": json.loads(p.treatment_details),
            "start_date": p.start_date,
            "end_date": p.end_date,
            "created_at": p.created_at
        }
        for p in plans
    ])


# ================= MEDICAL ADVICE (CHAT) =================

@api_view(['POST'])
def send_medical_advice(request):
    sender_role = request.data.get("sender_role")
    message = request.data.get("message")

    if sender_role == "patient":
        patient = Patient.objects.get(
            user__user_id=request.data['patient_user_id']
        )
        doctor = patient.doctor

    elif sender_role == "doctor":
        patient = Patient.objects.get(
            patient_id=request.data['patient_id']
        )
        doctor = Doctor.objects.get(
            user__user_id=request.data['doctor_user_id']
        )
    else:
        return Response(
            {"error": "Invalid sender_role"},
            status=status.HTTP_400_BAD_REQUEST
        )

    MedicalAdviceMessage.objects.create(
        patient=patient,
        doctor=doctor,
        sender_role=sender_role,
        message=message
    )

    return Response({"status": "sent"}, status=201)


# ✅ PATIENT → LOAD CHAT (uses USER ID)
@api_view(['GET'])
def get_medical_advice_by_user(request, user_id):
    patient = Patient.objects.get(user__user_id=user_id)

    messages = MedicalAdviceMessage.objects.filter(
        patient=patient
    ).order_by("created_at")

    return Response([
        {
            "sender_role": m.sender_role,
            "message": m.message,
            "created_at": m.created_at
        }
        for m in messages
    ])


# ✅ DOCTOR → LOAD CHAT (uses PATIENT ID)
@api_view(['GET'])
def get_medical_advice_by_patient(request, patient_id):
    messages = MedicalAdviceMessage.objects.filter(
        patient_id=patient_id
    ).order_by("created_at")

    return Response([
        {
            "sender_role": m.sender_role,
            "message": m.message,
            "created_at": m.created_at
        }
        for m in messages
    ])


# ✅ DOCTOR → PATIENT LIST FOR CHAT (🔥 THIS WAS MISSING)
@api_view(['GET'])
def doctor_medical_advice_patients(request, user_id):
    doctor = Doctor.objects.get(user__user_id=user_id)

    patients = Patient.objects.filter(doctor=doctor)

    response = []
    for p in patients:
        last_message = MedicalAdviceMessage.objects.filter(
            patient=p
        ).order_by("-created_at").first()

        response.append({
            "patient_id": p.patient_id,
            "patient_name": p.patient_name,
            "age": p.age,
            "last_message": last_message.message if last_message else "No messages yet",
            "unread": last_message.sender_role == "patient" if last_message else False
        })

    return Response(response)

# ================= APPOINTMENTS =================

from django.shortcuts import get_object_or_404
from .models import AppointmentRescheduleRequest


# ================= CREATE APPOINTMENT (Doctor) =================
@api_view(['POST'])
def create_appointment(request):
    try:
        patient_user_id = request.data.get('patient_user_id')
        doctor_user_id = request.data.get('doctor_user_id')

        patient = get_object_or_404(
            Patient,
            user__user_id=patient_user_id
        )

        doctor = get_object_or_404(
            Doctor,
            user__user_id=doctor_user_id
        )

        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_date=request.data['appointment_date'],
            appointment_time=request.data['appointment_time'],
            notes_for_patient=request.data.get('notes_for_patient', ''),
            status='CONFIRMED',
            patient_confirmed=False
        )

        send_mail(
            subject="Appointment Scheduled – GlucoCare",
            message=f"""
Hello {patient.patient_name},

Your appointment has been scheduled.

Doctor: {doctor.doctor_name}
Date: {appointment.appointment_date}
Time: {appointment.appointment_time}

Regards,
GlucoCare Team
""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[patient.user.email],
            fail_silently=True
        )

        return Response({
            "appointment_id": appointment.appointment_id,
            "status": appointment.status
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# ================= PATIENT CONFIRM ATTENDANCE =================
@api_view(['POST'])
def confirm_attendance(request):
    appointment = get_object_or_404(
        Appointment,
        appointment_id=request.data['appointment_id']
    )

    appointment.status = 'PATIENT_CONFIRMED'
    appointment.patient_confirmed = True
    appointment.save()

    return Response({"message": "Attendance confirmed"})


# ================= PATIENT REQUEST RESCHEDULE =================
@api_view(['POST'])
def request_reschedule(request):
    appointment = get_object_or_404(
        Appointment,
        appointment_id=request.data['appointment_id']
    )

    requested_date = request.data.get('requested_date') or request.data.get('new_date')
    requested_time = request.data.get('requested_time') or request.data.get('new_time')

    if not requested_date or not requested_time:
        return Response(
            {"error": "requested_date and requested_time are required"},
            status=400
        )

    # Prevent duplicate pending request
    existing = AppointmentRescheduleRequest.objects.filter(
        appointment=appointment,
        status='PENDING'
    ).first()

    if existing:
        return Response(
            {"error": "Reschedule request already pending"},
            status=400
        )

    AppointmentRescheduleRequest.objects.create(
        appointment=appointment,
        requested_date=requested_date,
        requested_time=requested_time,
        status='PENDING'
    )

    appointment.status = 'RESCHEDULE_REQUESTED'
    appointment.save(update_fields=['status'])

    return Response({"message": "Reschedule requested"})


# ================= DOCTOR VIEW RESCHEDULE REQUESTS =================
@api_view(['GET'])
def doctor_reschedule_requests(request, doctor_user_id):
    doctor = get_object_or_404(
        Doctor,
        user__user_id=doctor_user_id
    )

    requests = AppointmentRescheduleRequest.objects.filter(
        appointment__doctor=doctor,
        status='PENDING'
    ).select_related('appointment', 'appointment__patient')

    return Response([
        {
            "request_id": r.id,
            "appointment_id": r.appointment.appointment_id,
            "patient_name": r.appointment.patient.patient_name,
            "original_date": r.appointment.appointment_date,
            "original_time": r.appointment.appointment_time,
            "requested_date": r.requested_date,
            "requested_time": r.requested_time
        }
        for r in requests
    ])


# ================= DOCTOR APPROVE RESCHEDULE =================
@api_view(['POST'])
def approve_reschedule(request):
    request_id = request.data.get('request_id')
    appointment_id = request.data.get('appointment_id')

    if request_id:
        req = get_object_or_404(
            AppointmentRescheduleRequest,
            id=request_id
        )
    elif appointment_id:
        req = AppointmentRescheduleRequest.objects.filter(
            appointment__appointment_id=appointment_id,
            status='PENDING'
        ).order_by('-created_at').first()
        if not req:
            return Response(
                {"error": "No pending reschedule request found for this appointment"},
                status=400
            )
    else:
        return Response(
            {"error": "request_id or appointment_id is required"},
            status=400
        )

    appointment = req.appointment

    appointment.appointment_date = req.requested_date
    appointment.appointment_time = req.requested_time
    appointment.status = 'CONFIRMED'
    appointment.patient_confirmed = False
    appointment.save()

    req.status = 'APPROVED'
    req.save()

    send_mail(
        subject="Reschedule Approved – GlucoCare",
        message=f"""
Hello {appointment.patient.patient_name},

Your reschedule request has been approved.

New Date: {appointment.appointment_date}
New Time: {appointment.appointment_time}

Regards,
GlucoCare Team
""",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[appointment.patient.user.email],
        fail_silently=True
    )

    return Response({"message": "Reschedule approved"})


# ================= DOCTOR REJECT RESCHEDULE =================
@api_view(['POST'])
def reject_reschedule(request):
    request_id = request.data.get('request_id')
    appointment_id = request.data.get('appointment_id')

    if request_id:
        req = get_object_or_404(
            AppointmentRescheduleRequest,
            id=request_id
        )
    elif appointment_id:
        req = AppointmentRescheduleRequest.objects.filter(
            appointment__appointment_id=appointment_id,
            status='PENDING'
        ).order_by('-created_at').first()
        if not req:
            return Response(
                {"error": "No pending reschedule request found for this appointment"},
                status=400
            )
    else:
        return Response(
            {"error": "request_id or appointment_id is required"},
            status=400
        )

    req.status = 'REJECTED'
    req.save()

    appointment = req.appointment
    appointment.status = 'CONFIRMED'
    appointment.save(update_fields=['status'])

    return Response({"message": "Reschedule rejected"})


# ================= CANCEL APPOINTMENT =================
@api_view(['POST'])
def cancel_appointment(request):
    appointment = get_object_or_404(
        Appointment,
        appointment_id=request.data['appointment_id']
    )

    appointment.status = 'CANCELLED'
    appointment.save()

    return Response({"message": "Appointment cancelled"})


# ================= COMPLETE APPOINTMENT =================
@api_view(['POST'])
def complete_appointment(request):
    appointment = get_object_or_404(
        Appointment,
        appointment_id=request.data['appointment_id']
    )

    appointment.status = 'COMPLETED'
    appointment.save()

    return Response({"message": "Appointment completed"})


# ================= DOCTOR TODAY APPOINTMENTS =================
@api_view(['GET'])
def doctor_today_appointments(request, doctor_user_id):
    doctor = get_object_or_404(
        Doctor,
        user__user_id=doctor_user_id
    )

    appointments = Appointment.objects.filter(
        doctor=doctor,
        appointment_date=date.today(),
        status__in=['CONFIRMED', 'PATIENT_CONFIRMED']
    ).order_by('appointment_time')

    return Response([
        {
            "appointment_id": a.appointment_id,
            "patient_name": a.patient.patient_name,
            "time": a.appointment_time,
            "status": a.status
        }
        for a in appointments
    ])


# ================= PATIENT APPOINTMENTS =================
@api_view(['GET'])
def patient_appointments(request, user_id):
    patient = get_object_or_404(
        Patient,
        user__user_id=user_id
    )

    appointments = Appointment.objects.filter(
        patient=patient
    ).order_by('-appointment_date', '-appointment_time')

    return Response([
        {
            "appointment_id": a.appointment_id,
            "doctor_name": a.doctor.doctor_name,
            "date": a.appointment_date,
            "time": a.appointment_time,
            "status": a.status
        }
        for a in appointments
    ])


# ================= SEND APPOINTMENT REMINDERS =================
@api_view(['POST'])
def send_appointment_reminders(request):
    now = timezone.now()
    window_end = now + timedelta(minutes=5)
    sent_count = 0

    appointments = Appointment.objects.filter(
        status__in=['CONFIRMED', 'PATIENT_CONFIRMED'],
        reminder_sent=False
    ).select_related('doctor', 'patient', 'patient__user')

    for appointment in appointments:
        appointment_dt = datetime.combine(
            appointment.appointment_date,
            appointment.appointment_time
        )
        if timezone.is_naive(appointment_dt):
            appointment_dt = timezone.make_aware(
                appointment_dt,
                timezone.get_current_timezone()
            )

        if now <= appointment_dt <= window_end:
            patient_email = appointment.patient.user.email
            if not patient_email:
                continue

            send_mail(
                subject="Appointment Reminder - GlucoCare",
                message=f"""
Hello {appointment.patient.patient_name},

This is a reminder that your appointment starts in 5 minutes.

Doctor: {appointment.doctor.doctor_name}
Date: {appointment.appointment_date}
Time: {appointment.appointment_time}

Regards,
GlucoCare Team
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[patient_email],
                fail_silently=False
            )

            appointment.reminder_sent = True
            appointment.save(update_fields=['reminder_sent'])
            sent_count += 1

    return Response({
        "message": "Appointment reminder check completed",
        "reminders_sent": sent_count
    })
