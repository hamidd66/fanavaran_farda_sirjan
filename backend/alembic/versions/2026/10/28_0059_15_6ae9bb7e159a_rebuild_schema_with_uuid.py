"""rebuild_schema_with_uuid

WARNING: This migration destroys all data in the 13 application tables.
PostgreSQL enum types and Alembic version tracking are preserved.
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '6ae9bb7e159a'
down_revision: Union[str, Sequence[str], None] = 'ecfb525367fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Destroy old schema data, rebuild tables with UUID keys."""
    op.drop_index(op.f('ix_user_specialties_specialty_id'), table_name='user_specialties')
    op.drop_index(op.f('ix_user_specialties_person_id'), table_name='user_specialties')
    op.drop_index(op.f('ix_user_specialties_id'), table_name='user_specialties')
    op.drop_index(op.f('ix_user_specialties_assigned_by'), table_name='user_specialties')
    op.drop_table('user_specialties')
    op.drop_index(op.f('ix_user_roles_user_id'), table_name='user_roles')
    op.drop_index(op.f('ix_user_roles_role_id'), table_name='user_roles')
    op.drop_index(op.f('ix_user_roles_id'), table_name='user_roles')
    op.drop_index(op.f('ix_user_roles_assigned_by'), table_name='user_roles')
    op.drop_table('user_roles')
    op.drop_index(op.f('ix_student_profiles_person_id'), table_name='student_profiles')
    op.drop_index(op.f('ix_student_profiles_id'), table_name='student_profiles')
    op.drop_table('student_profiles')
    op.drop_index(op.f('ix_staff_profiles_person_id'), table_name='staff_profiles')
    op.drop_index(op.f('ix_staff_profiles_id'), table_name='staff_profiles')
    op.drop_table('staff_profiles')
    op.drop_index(op.f('ix_file_attachments_id'), table_name='file_attachments')
    op.drop_table('file_attachments')
    op.drop_index(op.f('ix_courses_title'), table_name='courses')
    op.drop_index(op.f('ix_courses_id'), table_name='courses')
    op.drop_index(op.f('ix_courses_created_by'), table_name='courses')
    op.drop_index(op.f('ix_courses_category_id'), table_name='courses')
    op.drop_table('courses')
    op.drop_index(op.f('ix_specialties_id'), table_name='specialties')
    op.drop_index(op.f('ix_specialties_created_by'), table_name='specialties')
    op.drop_table('specialties')
    op.drop_index(op.f('ix_roles_id'), table_name='roles')
    op.drop_index(op.f('ix_roles_created_by'), table_name='roles')
    op.drop_table('roles')
    op.drop_index(op.f('ix_persons_user_id'), table_name='persons')
    op.drop_index(op.f('ix_persons_id'), table_name='persons')
    op.drop_table('persons')
    op.drop_index(op.f('ix_files_id'), table_name='files')
    op.drop_table('files')
    op.drop_index(op.f('ix_course_categories_slug'), table_name='course_categories')
    op.drop_index(op.f('ix_course_categories_name'), table_name='course_categories')
    op.drop_index(op.f('ix_course_categories_id'), table_name='course_categories')
    op.drop_index(op.f('ix_course_categories_created_by'), table_name='course_categories')
    op.drop_table('course_categories')
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_users_national_code'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    op.create_table('users',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('national_code', sa.String(length=10), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('token_version', sa.Integer(), nullable=False),
    sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True),
    sa.Column('failed_login_count', sa.Integer(), nullable=False),
    sa.Column('is_deleted', sa.Boolean(), nullable=False),
    sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users'))
    )
    op.create_index(op.f('ix_users_national_code'), 'users', ['national_code'], unique=True)
    op.create_table('audit_logs',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('entity_type', sa.String(length=50), nullable=False),
    sa.Column('action', postgresql.ENUM('create', 'update', 'delete', name='actiontypes', create_type=False), nullable=False),
    sa.Column('changed_fields', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_audit_logs_user_id_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_audit_logs'))
    )
    op.create_table('course_categories',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('slug', sa.String(length=150), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('display_order', sa.Integer(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_course_categories_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_course_categories'))
    )
    op.create_index(op.f('ix_course_categories_created_by'), 'course_categories', ['created_by'], unique=False)
    op.create_index(op.f('ix_course_categories_name'), 'course_categories', ['name'], unique=True)
    op.create_index(op.f('ix_course_categories_slug'), 'course_categories', ['slug'], unique=True)
    op.create_table('files',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('uploaded_by', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('file_path', sa.String(length=500), nullable=False),
    sa.Column('extension', sa.String(length=20), nullable=False),
    sa.Column('size_bytes', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], name=op.f('fk_files_uploaded_by_users'), ondelete='RESTRICT'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_files'))
    )
    op.create_table('persons',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('full_name', sa.String(length=120), nullable=False),
    sa.Column('father_name', sa.String(length=80), nullable=False),
    sa.Column('birth_date', sa.Date(), nullable=False),
    sa.Column('gender', postgresql.ENUM('male', 'female', name='gender', create_type=False), nullable=False),
    sa.Column('phone', sa.String(length=11), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('address', sa.String(length=300), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('field_of_study', sa.String(length=255), nullable=True),
    sa.Column('education_level', postgresql.ENUM('illiterate', 'elementary_1', 'elementary_2', 'elementary_3', 'elementary_4', 'elementary_5', 'elementary_6', 'middle_school_7', 'middle_school_8', 'middle_school_9', 'high_school_10', 'high_school_11', 'high_school_12', 'diploma', 'associate', 'bachelor', 'master', 'doctorate', name='educationlevel', create_type=False), nullable=False),
    sa.Column('referral_source', postgresql.ENUM('friend_referral', 'school_or_work', 'alumni', 'passing_by', 'banner_ads', 'poster', 'route_finder', 'instagram', 'rubika', 'google_search', 'website', 'ai_suggestion', 'sms_marketing', 'other', name='referralsources', create_type=False), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_persons_user_id_users'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_persons')),
    sa.UniqueConstraint('email', name=op.f('uq_persons_email')),
    sa.UniqueConstraint('phone', name=op.f('uq_persons_phone'))
    )
    op.create_index(op.f('ix_persons_user_id'), 'persons', ['user_id'], unique=True)
    op.create_table('roles',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_roles_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_roles')),
    sa.UniqueConstraint('name', name=op.f('uq_roles_name'))
    )
    op.create_index(op.f('ix_roles_created_by'), 'roles', ['created_by'], unique=False)
    op.create_table('specialties',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_specialties_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_specialties')),
    sa.UniqueConstraint('name', name=op.f('uq_specialties_name'))
    )
    op.create_index(op.f('ix_specialties_created_by'), 'specialties', ['created_by'], unique=False)
    op.create_table('courses',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('category_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('prerequisites', sa.String(length=300), nullable=False),
    sa.Column('short_description', sa.String(length=500), nullable=False),
    sa.Column('long_description', sa.Text(), nullable=False),
    sa.Column('has_certificate', sa.Boolean(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('is_deleted', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['course_categories.id'], name=op.f('fk_courses_category_id_course_categories'), ondelete='RESTRICT'),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_courses_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_courses'))
    )
    op.create_index(op.f('ix_courses_category_id'), 'courses', ['category_id'], unique=False)
    op.create_index(op.f('ix_courses_created_by'), 'courses', ['created_by'], unique=False)
    op.create_index(op.f('ix_courses_title'), 'courses', ['title'], unique=False)
    op.create_table('file_attachments',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('file_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('entity_type', sa.String(length=100), nullable=False),
    sa.Column('purpose', sa.String(length=100), nullable=False),
    sa.Column('display_order', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['file_id'], ['files.id'], name=op.f('fk_file_attachments_file_id_files'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_file_attachments')),
    sa.UniqueConstraint('entity_id', 'entity_type', 'purpose', 'display_order', deferrable=True, initially='DEFERRED', name='uq_attachment_display_order')
    )
    op.create_table('staff_profiles',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('person_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('employment_status', postgresql.ENUM('active', 'inactive', 'suspended', name='staffemploymentstatus', create_type=False), nullable=False),
    sa.Column('employment_type', postgresql.ENUM('full_time', 'part_time', 'contractual', 'hourly', 'project_based', 'volunteer', name='employmenttype', create_type=False), nullable=False),
    sa.Column('job_title', sa.String(length=120), nullable=False),
    sa.Column('card_number', sa.String(length=19), nullable=False),
    sa.Column('sheba_number', sa.String(length=26), nullable=False),
    sa.Column('hire_date', sa.Date(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['person_id'], ['persons.id'], name=op.f('fk_staff_profiles_person_id_persons'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_staff_profiles'))
    )
    op.create_index(op.f('ix_staff_profiles_person_id'), 'staff_profiles', ['person_id'], unique=True)
    op.create_table('student_profiles',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('person_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('educational_status', postgresql.ENUM('active', 'graduated', 'suspended', name='studenteducationalstatus', create_type=False), nullable=False),
    sa.Column('parent_phone', sa.String(length=11), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['person_id'], ['persons.id'], name=op.f('fk_student_profiles_person_id_persons'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_student_profiles'))
    )
    op.create_index(op.f('ix_student_profiles_person_id'), 'student_profiles', ['person_id'], unique=True)
    op.create_table('user_roles',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('role_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('assigned_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('is_access', sa.Boolean(), nullable=False),
    sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['assigned_by'], ['users.id'], name=op.f('fk_user_roles_assigned_by_users'), ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], name=op.f('fk_user_roles_role_id_roles'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_roles_user_id_users'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_user_roles'))
    )
    op.create_index(op.f('ix_user_roles_assigned_by'), 'user_roles', ['assigned_by'], unique=False)
    op.create_index(op.f('ix_user_roles_role_id'), 'user_roles', ['role_id'], unique=False)
    op.create_index(op.f('ix_user_roles_user_id'), 'user_roles', ['user_id'], unique=False)
    op.create_table('user_specialties',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('person_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('specialty_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('assigned_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['assigned_by'], ['users.id'], name=op.f('fk_user_specialties_assigned_by_users'), ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['person_id'], ['persons.id'], name=op.f('fk_user_specialties_person_id_persons'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['specialty_id'], ['specialties.id'], name=op.f('fk_user_specialties_specialty_id_specialties'), ondelete='RESTRICT'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_user_specialties'))
    )
    op.create_index(op.f('ix_user_specialties_assigned_by'), 'user_specialties', ['assigned_by'], unique=False)
    op.create_index(op.f('ix_user_specialties_person_id'), 'user_specialties', ['person_id'], unique=False)
    op.create_index(op.f('ix_user_specialties_specialty_id'), 'user_specialties', ['specialty_id'], unique=False)

def downgrade() -> None:
    """Destroy UUID schema data, recreate original String-key tables."""
    op.drop_index(op.f('ix_user_specialties_specialty_id'), table_name='user_specialties')
    op.drop_index(op.f('ix_user_specialties_person_id'), table_name='user_specialties')
    op.drop_index(op.f('ix_user_specialties_assigned_by'), table_name='user_specialties')
    op.drop_table('user_specialties')
    op.drop_index(op.f('ix_user_roles_user_id'), table_name='user_roles')
    op.drop_index(op.f('ix_user_roles_role_id'), table_name='user_roles')
    op.drop_index(op.f('ix_user_roles_assigned_by'), table_name='user_roles')
    op.drop_table('user_roles')
    op.drop_index(op.f('ix_student_profiles_person_id'), table_name='student_profiles')
    op.drop_table('student_profiles')
    op.drop_index(op.f('ix_staff_profiles_person_id'), table_name='staff_profiles')
    op.drop_table('staff_profiles')
    op.drop_table('file_attachments')
    op.drop_index(op.f('ix_courses_title'), table_name='courses')
    op.drop_index(op.f('ix_courses_created_by'), table_name='courses')
    op.drop_index(op.f('ix_courses_category_id'), table_name='courses')
    op.drop_table('courses')
    op.drop_index(op.f('ix_specialties_created_by'), table_name='specialties')
    op.drop_table('specialties')
    op.drop_index(op.f('ix_roles_created_by'), table_name='roles')
    op.drop_table('roles')
    op.drop_index(op.f('ix_persons_user_id'), table_name='persons')
    op.drop_table('persons')
    op.drop_table('files')
    op.drop_index(op.f('ix_course_categories_slug'), table_name='course_categories')
    op.drop_index(op.f('ix_course_categories_name'), table_name='course_categories')
    op.drop_index(op.f('ix_course_categories_created_by'), table_name='course_categories')
    op.drop_table('course_categories')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_users_national_code'), table_name='users')
    op.drop_table('users')
    op.create_table('users',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('national_code', sa.String(length=10), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('token_version', sa.Integer(), nullable=False),
    sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True),
    sa.Column('failed_login_count', sa.Integer(), nullable=False),
    sa.Column('is_deleted', sa.Boolean(), nullable=False),
    sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users'))
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=True)
    op.create_index(op.f('ix_users_national_code'), 'users', ['national_code'], unique=True)
    op.create_table('audit_logs',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=True),
    sa.Column('entity_id', sa.String(), nullable=True),
    sa.Column('entity_type', sa.String(length=50), nullable=False),
    sa.Column('action', postgresql.ENUM('create', 'update', 'delete', name='actiontypes', create_type=False), nullable=False),
    sa.Column('changed_fields', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_audit_logs_user_id_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_audit_logs'))
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=True)
    op.create_table('course_categories',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('created_by', sa.String(), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('slug', sa.String(length=150), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('display_order', sa.Integer(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_course_categories_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_course_categories'))
    )
    op.create_index(op.f('ix_course_categories_created_by'), 'course_categories', ['created_by'], unique=False)
    op.create_index(op.f('ix_course_categories_id'), 'course_categories', ['id'], unique=True)
    op.create_index(op.f('ix_course_categories_name'), 'course_categories', ['name'], unique=True)
    op.create_index(op.f('ix_course_categories_slug'), 'course_categories', ['slug'], unique=True)
    op.create_table('files',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('uploaded_by', sa.String(), nullable=False),
    sa.Column('file_path', sa.String(length=500), nullable=False),
    sa.Column('extension', sa.String(length=20), nullable=False),
    sa.Column('size_bytes', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], name=op.f('fk_files_uploaded_by_users'), ondelete='RESTRICT'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_files'))
    )
    op.create_index(op.f('ix_files_id'), 'files', ['id'], unique=True)
    op.create_table('persons',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('full_name', sa.String(length=120), nullable=False),
    sa.Column('father_name', sa.String(length=80), nullable=False),
    sa.Column('birth_date', sa.Date(), nullable=False),
    sa.Column('gender', postgresql.ENUM('male', 'female', name='gender', create_type=False), nullable=False),
    sa.Column('phone', sa.String(length=11), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('address', sa.String(length=300), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('field_of_study', sa.String(length=255), nullable=True),
    sa.Column('education_level', postgresql.ENUM('illiterate', 'elementary_1', 'elementary_2', 'elementary_3', 'elementary_4', 'elementary_5', 'elementary_6', 'middle_school_7', 'middle_school_8', 'middle_school_9', 'high_school_10', 'high_school_11', 'high_school_12', 'diploma', 'associate', 'bachelor', 'master', 'doctorate', name='educationlevel', create_type=False), nullable=False),
    sa.Column('referral_source', postgresql.ENUM('friend_referral', 'school_or_work', 'alumni', 'passing_by', 'banner_ads', 'poster', 'route_finder', 'instagram', 'rubika', 'google_search', 'website', 'ai_suggestion', 'sms_marketing', 'other', name='referralsources', create_type=False), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_persons_user_id_users'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_persons')),
    sa.UniqueConstraint('email', name=op.f('uq_persons_email')),
    sa.UniqueConstraint('phone', name=op.f('uq_persons_phone'))
    )
    op.create_index(op.f('ix_persons_id'), 'persons', ['id'], unique=True)
    op.create_index(op.f('ix_persons_user_id'), 'persons', ['user_id'], unique=True)
    op.create_table('roles',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('created_by', sa.String(), nullable=True),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_roles_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_roles')),
    sa.UniqueConstraint('name', name=op.f('uq_roles_name'))
    )
    op.create_index(op.f('ix_roles_created_by'), 'roles', ['created_by'], unique=False)
    op.create_index(op.f('ix_roles_id'), 'roles', ['id'], unique=True)
    op.create_table('specialties',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('created_by', sa.String(), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_specialties_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_specialties')),
    sa.UniqueConstraint('name', name=op.f('uq_specialties_name'))
    )
    op.create_index(op.f('ix_specialties_created_by'), 'specialties', ['created_by'], unique=False)
    op.create_index(op.f('ix_specialties_id'), 'specialties', ['id'], unique=True)
    op.create_table('courses',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('category_id', sa.String(), nullable=False),
    sa.Column('created_by', sa.String(), nullable=True),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('prerequisites', sa.String(length=300), nullable=False),
    sa.Column('short_description', sa.String(length=500), nullable=False),
    sa.Column('long_description', sa.Text(), nullable=False),
    sa.Column('has_certificate', sa.Boolean(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('is_deleted', sa.Boolean(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['course_categories.id'], name=op.f('fk_courses_category_id_course_categories'), ondelete='RESTRICT'),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name=op.f('fk_courses_created_by_users'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_courses'))
    )
    op.create_index(op.f('ix_courses_category_id'), 'courses', ['category_id'], unique=False)
    op.create_index(op.f('ix_courses_created_by'), 'courses', ['created_by'], unique=False)
    op.create_index(op.f('ix_courses_id'), 'courses', ['id'], unique=True)
    op.create_index(op.f('ix_courses_title'), 'courses', ['title'], unique=False)
    op.create_table('file_attachments',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('file_id', sa.String(), nullable=False),
    sa.Column('entity_id', sa.String(), nullable=False),
    sa.Column('entity_type', sa.String(length=100), nullable=False),
    sa.Column('purpose', sa.String(length=100), nullable=False),
    sa.Column('display_order', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['file_id'], ['files.id'], name=op.f('fk_file_attachments_file_id_files'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_file_attachments')),
    sa.UniqueConstraint('entity_id', 'entity_type', 'purpose', 'display_order', deferrable=True, initially='DEFERRED', name='uq_attachment_display_order')
    )
    op.create_index(op.f('ix_file_attachments_id'), 'file_attachments', ['id'], unique=True)
    op.create_table('staff_profiles',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('person_id', sa.String(), nullable=False),
    sa.Column('employment_status', postgresql.ENUM('active', 'inactive', 'suspended', name='staffemploymentstatus', create_type=False), nullable=False),
    sa.Column('employment_type', postgresql.ENUM('full_time', 'part_time', 'contractual', 'hourly', 'project_based', 'volunteer', name='employmenttype', create_type=False), nullable=False),
    sa.Column('job_title', sa.String(length=120), nullable=False),
    sa.Column('card_number', sa.String(length=19), nullable=False),
    sa.Column('sheba_number', sa.String(length=26), nullable=False),
    sa.Column('hire_date', sa.Date(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['person_id'], ['persons.id'], name=op.f('fk_staff_profiles_person_id_persons'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_staff_profiles'))
    )
    op.create_index(op.f('ix_staff_profiles_id'), 'staff_profiles', ['id'], unique=True)
    op.create_index(op.f('ix_staff_profiles_person_id'), 'staff_profiles', ['person_id'], unique=True)
    op.create_table('student_profiles',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('person_id', sa.String(), nullable=False),
    sa.Column('educational_status', postgresql.ENUM('active', 'graduated', 'suspended', name='studenteducationalstatus', create_type=False), nullable=False),
    sa.Column('parent_phone', sa.String(length=11), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['person_id'], ['persons.id'], name=op.f('fk_student_profiles_person_id_persons'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_student_profiles'))
    )
    op.create_index(op.f('ix_student_profiles_id'), 'student_profiles', ['id'], unique=True)
    op.create_index(op.f('ix_student_profiles_person_id'), 'student_profiles', ['person_id'], unique=True)
    op.create_table('user_roles',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('role_id', sa.String(), nullable=False),
    sa.Column('assigned_by', sa.String(), nullable=True),
    sa.Column('is_access', sa.Boolean(), nullable=False),
    sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['assigned_by'], ['users.id'], name=op.f('fk_user_roles_assigned_by_users'), ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], name=op.f('fk_user_roles_role_id_roles'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_roles_user_id_users'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_user_roles'))
    )
    op.create_index(op.f('ix_user_roles_assigned_by'), 'user_roles', ['assigned_by'], unique=False)
    op.create_index(op.f('ix_user_roles_id'), 'user_roles', ['id'], unique=True)
    op.create_index(op.f('ix_user_roles_role_id'), 'user_roles', ['role_id'], unique=False)
    op.create_index(op.f('ix_user_roles_user_id'), 'user_roles', ['user_id'], unique=False)
    op.create_table('user_specialties',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('person_id', sa.String(), nullable=False),
    sa.Column('specialty_id', sa.String(), nullable=False),
    sa.Column('assigned_by', sa.String(), nullable=True),
    sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['assigned_by'], ['users.id'], name=op.f('fk_user_specialties_assigned_by_users'), ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['person_id'], ['persons.id'], name=op.f('fk_user_specialties_person_id_persons'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['specialty_id'], ['specialties.id'], name=op.f('fk_user_specialties_specialty_id_specialties'), ondelete='RESTRICT'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_user_specialties'))
    )
    op.create_index(op.f('ix_user_specialties_assigned_by'), 'user_specialties', ['assigned_by'], unique=False)
    op.create_index(op.f('ix_user_specialties_id'), 'user_specialties', ['id'], unique=True)
    op.create_index(op.f('ix_user_specialties_person_id'), 'user_specialties', ['person_id'], unique=False)
    op.create_index(op.f('ix_user_specialties_specialty_id'), 'user_specialties', ['specialty_id'], unique=False)
