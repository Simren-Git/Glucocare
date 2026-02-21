from django.db import models

# ---------------- USERS ----------------
class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=10)  # doctor / patient
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'


# ---------------- DOCTORS ----------------
class Doctor(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    doctor_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    hospital_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'doctors'


# ---------------- PATIENTS ----------------
class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'patients'


class BloodSugarRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    
    sugar_level = models.FloatField()
    measurement_type = models.CharField(max_length=20)  # Before Meal / Post Meal / Random

    food_item = models.CharField(max_length=255, null=True, blank=True)
    insulin_units = models.FloatField(null=True, blank=True)

    date = models.DateField(null=True, blank=True)
    time = models.CharField(max_length=10, null=True, blank=True)

    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'blood_sugar_records'
# ---------------- MEAL LOGS ----------------
class MealLog(models.Model):
    meal_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=20)  # breakfast/lunch/dinner/snack
    food_description = models.TextField()
    meal_time = models.DateTimeField()

    class Meta:
        db_table = 'meal_logs'


# ---------------- INSULIN LOGS ----------------
class InsulinLog(models.Model):
    insulin_log_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    insulin_type = models.CharField(max_length=50)
    dosage = models.CharField(max_length=50)
    taken_at = models.DateTimeField()

    class Meta:
        db_table = 'insulin_logs'


# ---------------- TREATMENT PLANS ----------------
class TreatmentPlan(models.Model):
    treatment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    treatment_details = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'treatment_plans'


# ---------------- DIET PLANS ----------------
class DietPlan(models.Model):
    diet_plan_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    diet_details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'diet_plans'



# ---------------- APPOINTMENTS ----------------
class Appointment(models.Model):
    appointment_id = models.AutoField(primary_key=True)

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE
    )

    appointment_date = models.DateField()
    appointment_time = models.TimeField()

    # Used when patient requests reschedule
    new_date = models.DateField(null=True, blank=True)
    new_time = models.TimeField(null=True, blank=True)

    notes_for_patient = models.TextField(blank=True)

    # CONFIRMED
    # PATIENT_CONFIRMED
    # RESCHEDULE_REQUESTED
    # COMPLETED
    # CANCELLED
    status = models.CharField(
        max_length=30,
        default='CONFIRMED'
    )

    # Patient attendance confirmation
    patient_confirmed = models.BooleanField(default=False)

    # For future reminder system
    reminder_sent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'appointments'
        unique_together = (
            'doctor',
            'appointment_date',
            'appointment_time'
        )

# ---------------- MEDICAL ADVICE (CHAT) ----------------
class MedicalAdviceMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    sender_role = models.CharField(
        max_length=10,
        choices=[('doctor', 'Doctor'), ('patient', 'Patient')]
    )

    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'medical_advice_messages'
        ordering = ['created_at']


# ---------------- PAYMENTS ----------------
class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)

    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_status = models.CharField(
        max_length=20,
        default='PENDING'
    )
    # PENDING / SUCCESS / FAILED

    razorpay_order_id = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )

    razorpay_payment_id = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )

    razorpay_signature = models.CharField(
        max_length=500,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
class AppointmentRescheduleRequest(models.Model):
    id = models.AutoField(primary_key=True)

    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE
    )

    requested_date = models.DateField()
    requested_time = models.TimeField()

    status = models.CharField(
        max_length=20,
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'appointment_reschedule_requests'

