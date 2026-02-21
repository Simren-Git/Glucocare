from django.urls import path
from .views import *

urlpatterns = [

    # ================= AUTH =================
    path('login/', login),

    # ================= DOCTOR =================
    path('create-doctor/', create_doctor),
    path('doctor/total-patients/', total_patients),
    path('doctor/recent-patients/', recent_patients),
    path('doctor/patients/<int:doctor_user_id>/', doctor_patients),

    # ================= PATIENT =================
    path('register-patient/', register_patient),
    path('patient/<int:user_id>/', patient_profile),

    # ================= BLOOD SUGAR =================
    path('add-blood-sugar/', add_blood_sugar),
    path('blood-sugar-history/<int:user_id>/', blood_sugar_history),
    path('blood-glucose/<int:user_id>/', get_blood_glucose_records),

    # ================= DIET PLAN =================
    path('diet-plan/create/', create_diet_plan),
    path('diet-plan/<int:user_id>/', get_diet_plans),

    # ================= TREATMENT PLAN =================
    path('treatment-plan/create/', create_treatment_plan),
    path('treatment-plan/<int:user_id>/', get_treatment_plans),

    # ================= MEDICAL ADVICE =================
    path('medical-advice/send/', send_medical_advice),
    path('medical-advice/user/<int:user_id>/', get_medical_advice_by_user),
    path('medical-advice/patient/<int:patient_id>/', get_medical_advice_by_patient),
    path('doctor/medical-advice/patients/<int:user_id>/', doctor_medical_advice_patients),

    # ================= APPOINTMENTS =================
    path('appointment/create/', create_appointment),
    path('appointment/confirm-attendance/', confirm_attendance),

    path('appointment/request-reschedule/', request_reschedule),
    path('appointment/approve-reschedule/', approve_reschedule),
    path('appointment/reject-reschedule/', reject_reschedule),
    path('appointment/send-reminders/', send_appointment_reminders),

    path(
        'doctor/reschedule-requests/<int:doctor_user_id>/',
        doctor_reschedule_requests
    ),

    path('appointment/cancel/', cancel_appointment),
    path('appointment/complete/', complete_appointment),

    path(
        'doctor/appointments/today/<int:doctor_user_id>/',
        doctor_today_appointments
    ),

    path(
        'patient/appointments/<int:user_id>/',
        patient_appointments
    ),
]
