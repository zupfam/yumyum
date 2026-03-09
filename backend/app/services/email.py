import resend
from backend.app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

def send_magic_link(email: str, token: str):
    # In a real app, you'd use a domain you own
    magic_link = f"http://localhost:5173/auth/verify?token={token}"
    
    params = {
        "from": settings.EMAIL_FROM,
        "to": [email],
        "subject": "Your YumYum Magic Link",
        "html": f"<strong>Click <a href='{magic_link}'>here</a> to log in to your YumYum dashboard.</strong><br/><br/>This link expires in 15 minutes.",
    }

    try:
        email_sent = resend.Emails.send(params)
        return email_sent
    except Exception as e:
        print(f"Error sending email: {e}")
        # In dev, we might want to log the link to console
        print(f"DEV MAGIC LINK: {magic_link}")
        return None
