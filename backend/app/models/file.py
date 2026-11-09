from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Enum, func, text, true, false, Index, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.file import StorageProvider, StorageType, FileCategory

class File(Base):
    __tablename__ = "files"

    __table_args__ = (
        Index(None, "uploaded_by", text("created_at DESC"), postgresql_where=text("uploaded_by IS NOT NULL")),
        Index(None, "checksum", "checksum_algorithm"),
        Index(None, "category", text("created_at DESC"), postgresql_where=text("deleted_at IS NULL")),
        Index(None, "deleted_at", postgresql_where=text("deleted_at IS NOT NULL")),

        CheckConstraint("file_size > 0", name="files_file_size_pos"),
        CheckConstraint("length(btrim(original_name)) > 0", name="files_original_name_not_blank"),
        CheckConstraint("stored_name ~ '^[A-Za-z0-9][A-Za-z0-9._-]*$'", name="files_stored_name_format"),
        CheckConstraint("extension ~ '^[a-z0-9]{1,50}$'", name="files_extension_format"),
        CheckConstraint("mime_type ~* '^[a-z0-9][a-z0-9!#$&^_.+-]*/[a-z0-9][a-z0-9!#$&^_.+-]*$'", name="files_mime_type_format"),
        CheckConstraint("(checksum_algorithm = 'md5' AND length(checksum) = 32) OR (checksum_algorithm = 'sha1' AND length(checksum) = 40) OR (checksum_algorithm = 'sha256' AND length(checksum) = 64)", name="files_checksum_length"),
        CheckConstraint("checksum ~ '^[0-9a-f]+$'", name="files_checksum_hex"),
        CheckConstraint("bucket_name IS NULL OR length(btrim(bucket_name)) > 0", name="files_bucket_name_not_blank"),
        CheckConstraint("storage_provider = 'local' OR bucket_name IS NOT NULL", name="files_bucket_required_for_cloud"),
        CheckConstraint("length(btrim(storage_path)) > 0 AND position('..' in storage_path) = 0", name="files_storage_path_safe"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="files_updated_after_created"),
        # CheckConstraint("deleted_at IS NULL OR is_active = false", name="files_deleted_not_active"),

        Index("uq_files_storage_location", "storage_provider", text("coalesce(bucket_name, '')"), "storage_path", unique=True),
        Index("uq_files_checksum_alive", "checksum_algorithm", "checksum", "file_size", unique=True, postgresql_where=text("deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    original_name = Column(String(255), nullable=False)
    stored_name = Column(String(255), nullable=False, unique=True)

    extension = Column(String(50), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    
    storage_type = Column(Enum(StorageType), nullable=False)
    storage_provider = Column(Enum(StorageProvider), nullable=False)
    bucket_name = Column(String(100), nullable=True)
    storage_path = Column(String(500), nullable=False)
    
    checksum = Column(String(64), nullable=False)
    checksum_algorithm = Column(String(20), nullable=False)
    
    category = Column(Enum(FileCategory), nullable=False)
    description = Column(Text, nullable=True)
    
    is_public = Column(Boolean, nullable=False, server_default=false())
    is_active = Column(Boolean, nullable=False, server_default=true())
    
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user = relationship("User", foreign_keys=[uploaded_by], back_populates="files")

    file_attachments = relationship("FileAttachment", back_populates="file", cascade="all, delete-orphan")
