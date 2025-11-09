import { getUserProfile, getDermatologistById } from './database';

interface AppointmentEmailData {
  appointmentId: string;
  userId: string;
  dermatologistId: string;
  scheduledAt: string;
  reason?: string;
}

export const sendAppointmentConfirmation = async (
  appointmentData: AppointmentEmailData
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const [userResult, dermResult] = await Promise.all([
      getUserProfile(appointmentData.userId),
      getDermatologistById(appointmentData.dermatologistId),
    ]);

    if (userResult.error || !userResult.data) {
      console.warn('Failed to fetch user information for email:', userResult.error);
      return { success: false, error: new Error('Failed to fetch user information') };
    }

    if (dermResult.error || !dermResult.data) {
      console.warn('Failed to fetch dermatologist information for email:', dermResult.error);
      return { success: false, error: new Error('Failed to fetch dermatologist information') };
    }

    const user = userResult.data;
    const dermatologist = dermResult.data;

    const appointmentDate = new Date(appointmentData.scheduledAt);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const emailSubject = `Appointment Confirmation - ${dermatologist.name}`;
    const emailBody = createEmailTemplate({
      userName: user.name || 'Valued Patient',
      dermatologistName: dermatologist.name,
      dermatologistSpecialty: dermatologist.specialty || 'Dermatology',
      appointmentDate: formattedDate,
      appointmentTime: formattedTime,
      location: dermatologist.location || 'Telehealth',
      appointmentId: appointmentData.appointmentId,
      reason: appointmentData.reason,
    });

    const emailResult = await sendEmailDirectly(user.email, emailSubject, emailBody);

    return emailResult;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return { success: false, error: error as Error };
  }
};

const sendEmailDirectly = async (
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to send email';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `HTTP error: ${response.status}`;
      } catch {
        errorMessage = `HTTP error: ${response.status} ${response.statusText}`;
      }
      console.error('Email sending failed:', errorMessage);
      return { success: false, error: new Error(errorMessage) };
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.messageId);

    return { success: true, error: null };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error as Error };
  }
};

const createEmailTemplate = (data: {
  userName: string;
  dermatologistName: string;
  dermatologistSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  appointmentId: string;
  reason?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Appointment Confirmed!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Dear ${data.userName},</p>
    
    <p style="font-size: 16px;">Your appointment has been successfully booked. Here are the details:</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="color: #667eea; margin-top: 0;">Appointment Details</h2>
      
      <p style="margin: 10px 0;"><strong>Dermatologist:</strong> ${data.dermatologistName}</p>
      <p style="margin: 10px 0;"><strong>Specialty:</strong> ${data.dermatologistSpecialty}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${data.appointmentDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
      <p style="margin: 10px 0;"><strong>Location:</strong> ${data.location}</p>
      ${data.reason ? `<p style="margin: 10px 0;"><strong>Reason:</strong> ${data.reason}</p>` : ''}
      <p style="margin: 10px 0;"><strong>Appointment ID:</strong> ${data.appointmentId}</p>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0;"><strong>📅 Important:</strong> Please mark this date and time in your calendar. You will receive a reminder 24 hours before your appointment.</p>
    </div>
    
    <p style="font-size: 16px;">If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
    
    <p style="font-size: 16px;">We look forward to seeing you!</p>
    
    <p style="font-size: 16px;">
      Best regards,<br>
      <strong>The AcneScan Team</strong>
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #666; text-align: center;">
      This is an automated confirmation email. Please do not reply to this message.<br>
      If you have any questions, please contact us through the AcneScan app.
    </p>
  </div>
</body>
</html>
  `;
};