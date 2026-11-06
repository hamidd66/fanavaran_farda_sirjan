import enum

class StorageType(enum.Enum):
    disk = "disk"                          # ذخیره‌سازی محلی روی سرور (Local Disk / NAS)
    object_storage = "object_storage"      # ذخیره‌سازی ابری (Object Storage)
    database = "database"                  # ذخیره‌سازی به صورت باینری در دیتابیس (برای فایل‌های بسیار کوچک مثل آواتار یا ایقون)
    remote_url = "remote_url"              # لینک خارجی (بدون فایل فیزیکی روی سرور شما؛ فقط ارجاع به URL بیرونی)


class StorageProvider(enum.Enum):
    # --- Local / On-Premise ---
    local = "local"                        # ذخیره روی پوشه محلی سرور اصلی (uploads/)
    nfs = "nfs"                            # ذخیره روی شبکه متصل (Network File System)

    # --- Cloud Object Storage (Global & Popular) ---
    aws_s3 = "aws_s3"                      # آمازون اس‌تری (Amazon S3)
    cloudflare_r2 = "cloudflare_r2"        # کلادفلر آر‌تو (Cloudflare R2 - بدون هزینه خروج داده)
    google_cloud_storage = "gcs"           # گوگل کلاد استوریج (Google Cloud Storage)
    azure_blob = "azure_blob"              # مایکروسافت ازور بلاب (Microsoft Azure Blob Storage)

    # --- Open Source / Self-Hosted Object Storage ---
    minio = "minio"                        # مینی‌او (MinIO - مناسب برای هاست شخصی یا سرور داخلی با پروتکل S3)
    ceph = "ceph"                          # سف (Ceph - برای کلاسترهای سازمانی بزرگ)

    # --- External / Third-Party ---
    external_url = "external_url"          # برای فایل‌هایی که هاست جداگانه یا CDN دارند


class EntityType(enum.Enum):
    persons = "persons"
    roles = "roles"
    specialties = "specialties"
    course_categories = "course_categories"
    courses = "courses"
    terms = "terms"
    session_contents = "session_contents"
    classroom_locations = "classroom_locations"
