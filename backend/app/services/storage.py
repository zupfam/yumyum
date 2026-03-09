import cloudinary
import cloudinary.uploader
from backend.app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image(file, folder="yumyum/images"):
    try:
        if not settings.CLOUDINARY_API_KEY:
            # Mock for dev if no keys
            return "https://via.placeholder.com/150"
            
        result = cloudinary.uploader.upload(file, folder=folder)
        return result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

def upload_video(file, folder="yumyum/videos"):
    try:
        if not settings.CLOUDINARY_API_KEY:
            # Mock for dev if no keys
            return "https://www.w3schools.com/html/mov_bbb.mp4"

        result = cloudinary.uploader.upload(file, folder=folder, resource_type="video")
        return result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None
