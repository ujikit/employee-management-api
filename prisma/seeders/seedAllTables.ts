import { 
  PrismaClient, Scope, PositionType, EmploymentType, EmployeeStatus, 
  UserStatus, Channel, ImportStatus, AttendanceType, AttendanceStatus, 
  PeriodStatus, ActionType 
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedAllTables(prismaExternal?: PrismaClient) {
  const prisma = prismaExternal ?? new PrismaClient();
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password@123', salt);

  try {
    console.log('🌱 Starting Database Seeding...');

    // 1. ROLES
    const rolesData = [
      { code: 'SUPERADMIN', name: 'Superadmin', description: 'System Administrator' },
      { code: 'MGR_HRD', name: 'Manager HRD', description: 'Manager Human Resources' },
      { code: 'ADM_HRD', name: 'Admin HRD', description: 'Admin Human Resources' },
    ];
    for (const r of rolesData) {
      await prisma.role.upsert({ where: { code: r.code }, update: {}, create: r });
    }

    const roleSuperadmin = await prisma.role.findUnique({ where: { code: 'SUPERADMIN' } });
    const roleMgrHrd = await prisma.role.findUnique({ where: { code: 'MGR_HRD' } });
    const roleAdmHrd = await prisma.role.findUnique({ where: { code: 'ADM_HRD' } });

    // 2. MODULES
    const modulesData = [
      { code: 'MOD_ROLE', name: 'Kelola Role' },
      { code: 'MOD_USER', name: 'Kelola User' },
      { code: 'MOD_PEGAWAI', name: 'Data Pegawai' },
      { code: 'MOD_PRESENSI', name: 'Presensi' },
      { code: 'MOD_TUNJANGAN', name: 'Tunjangan Transport' },
    ];
    for (const m of modulesData) {
      await prisma.module.upsert({ where: { code: m.code }, update: {}, create: m });
    }

    // 3. ROLE PERMISSIONS (Example for Superadmin & MOD_ROLE)
    const modRole = await prisma.module.findUnique({ where: { code: 'MOD_ROLE' } });
    
    if (roleSuperadmin && modRole) {
      await prisma.rolePermission.upsert({
        where: { role_id_module_id: { role_id: roleSuperadmin.id, module_id: modRole.id } },
        update: {},
        create: {
          role_id: roleSuperadmin.id,
          module_id: modRole.id,
          can_access: true,
          can_create: true,
          read_scope: Scope.ALL,
          update_scope: Scope.ALL,
          delete_scope: Scope.ALL
        }
      });
    }

    // 4. DEPARTMENTS
    const dept = await prisma.department.upsert({
      where: { code: 'HRD' },
      update: {},
      create: { code: 'HRD', name: 'Human Resources Department' }
    });

    // 5. POSITIONS
    const posMgr = await prisma.position.upsert({
      where: { code: 'MGR' }, update: {}, create: { code: 'MGR', name: 'Manager', position_type: PositionType.MANAGER }
    });
    const posStaff = await prisma.position.upsert({
      where: { code: 'STAF' }, update: {}, create: { code: 'STAF', name: 'Staff', position_type: PositionType.STAF }
    });

    // 6 & 7 & 8. REGIONS (Province -> Regency -> District)
    const province = await prisma.province.upsert({
      where: { code: 'DIY' }, update: {}, create: { code: 'DIY', name: 'Daerah Istimewa Yogyakarta' }
    });
    const regency = await prisma.regency.upsert({
      where: { code: 'SLM' }, update: {}, create: { code: 'SLM', name: 'Sleman', province_id: province.id }
    });
    const district = await prisma.district.upsert({
      where: { code: 'DPK' }, update: {}, create: { code: 'DPK', name: 'Depok', regency_id: regency.id }
    });

    // 9. EMPLOYEES
    // Employee for Superadmin
    const empSuperadmin = await prisma.employee.upsert({
      where: { nip: '123456789' },
      update: {},
      create: {
        nip: '123456789', name: 'John Doe', email: 'john.doe@company.com', phone: '+6281234567890',
        birth_place: 'Yogyakarta', birth_date: new Date('1990-01-01'), marital_status: 'kawin',
        children_count: 1, joined_at: new Date('2022-01-01'), employment_type: EmploymentType.PKWTT,
        gender: 'Laki-laki', distance_km: 15.5, full_address: 'Jl. Kaliurang KM 5',
        position_id: posMgr.id, department_id: dept.id, district_id: district.id, status: EmployeeStatus.ACTIVE
      }
    });

    // Employee for Manager HRD
    const empMgrHrd = await prisma.employee.upsert({
      where: { nip: '123456790' },
      update: {},
      create: {
        nip: '123456790', name: 'Jane Doe', email: 'jane.doe@company.com', phone: '+6281234567891',
        birth_place: 'Jakarta', birth_date: new Date('1992-05-15'), marital_status: 'kawin',
        children_count: 0, joined_at: new Date('2023-03-01'), employment_type: EmploymentType.PKWTT,
        gender: 'Perempuan', distance_km: 8.2, full_address: 'Jl. Gejayan',
        position_id: posMgr.id, department_id: dept.id, district_id: district.id, status: EmployeeStatus.ACTIVE
      }
    });

    // Employee for Admin HRD
    const empAdmHrd = await prisma.employee.upsert({
      where: { nip: '123456791' },
      update: {},
      create: {
        nip: '123456791', name: 'Bob Smith', email: 'bob.smith@company.com', phone: '+6281234567892',
        birth_place: 'Bandung', birth_date: new Date('1995-10-20'), marital_status: 'tidak kawin',
        children_count: 0, joined_at: new Date('2024-01-15'), employment_type: EmploymentType.PKWTT,
        gender: 'Laki-laki', distance_km: 20.0, full_address: 'Jl. Magelang',
        position_id: posStaff.id, department_id: dept.id, district_id: district.id, status: EmployeeStatus.ACTIVE
      }
    });

    // 10. EMPLOYEE EDUCATIONS (Example for Superadmin only)
    const educationCount = await prisma.employeeEducation.count({ where: { employee_id: empSuperadmin.id } });
    if (educationCount === 0) {
      await prisma.employeeEducation.create({
        data: {
          employee_id: empSuperadmin.id, education_level: 'S1', school_name: 'Universitas Gadjah Mada', graduation_year: 2012,
        }
      });
    }

    // 11. USERS
    // 11a. User Superadmin
    const userSuperadmin = await prisma.user.upsert({
      where: { username: 'johndoe' },
      update: {},
      create: {
        username: 'johndoe', email: 'john.doe@company.com', name: 'John Doe',
        password: defaultPassword, role_id: roleSuperadmin!.id, employee_id: empSuperadmin.id, status: UserStatus.ACTIVE
      }
    });

    // 11b. User Manager HRD
    const userMgrHrd = await prisma.user.upsert({
      where: { username: 'janedoe' },
      update: {},
      create: {
        username: 'janedoe', email: 'jane.doe@company.com', name: 'Jane Doe',
        password: defaultPassword, role_id: roleMgrHrd!.id, employee_id: empMgrHrd.id, status: UserStatus.ACTIVE
      }
    });

    // 11c. User Admin HRD
    const userAdmHrd = await prisma.user.upsert({
      where: { username: 'bobsmith' },
      update: {},
      create: {
        username: 'bobsmith', email: 'bob.smith@company.com', name: 'Bob Smith',
        password: defaultPassword, role_id: roleAdmHrd!.id, employee_id: empAdmHrd.id, status: UserStatus.ACTIVE
      }
    });

    // 12. LOGIN OTPS (for Superadmin)
    await prisma.loginOtp.create({
      data: {
        user_id: userSuperadmin.id, otp_hash: await bcrypt.hash('1234', salt),
        channel: Channel.EMAIL, sent_to: userSuperadmin.email!,
        expires_at: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes validity
      }
    });

    // 13. USER SESSIONS (for Superadmin)
    await prisma.userSession.create({
      data: {
        user_id: userSuperadmin.id, session_token: 'dummy-token-' + Date.now(),
        ip_address: '127.0.0.1', expires_at: new Date(Date.now() + 3 * 60 * 1000),
      }
    });

    // 14. ATTENDANCE IMPORTS
    const importLog = await prisma.attendanceImport.create({
      data: {
        user_id: userSuperadmin.id, original_filename: 'absensi_agustus.xlsx',
        period_year: 2026, period_month: 8, status: ImportStatus.COMPLETED,
        total_rows: 100, processed_rows: 100
      }
    });

    // 15. ATTENDANCES (for Superadmin)
    await prisma.attendance.upsert({
      where: { employee_id_attendance_date: { employee_id: empSuperadmin.id, attendance_date: new Date('2026-08-01') } },
      update: {},
      create: {
        employee_id: empSuperadmin.id, attendance_import_id: importLog.id,
        attendance_date: new Date('2026-08-01'), checkin_at: new Date('2026-08-01T07:50:00Z'),
        checkout_at: new Date('2026-08-01T17:10:00Z'), checkin_location: 'Gedung Utama',
        checkout_location: 'Gedung Utama', attendance_type: AttendanceType.HADIR,
        duration_hours: 9, status: AttendanceStatus.TERPENUHI,
      }
    });

    // 16. ATTENDANCE SUMMARIES (for Superadmin)
    await prisma.attendanceSummary.upsert({
      where: { employee_id_period_year_period_month: { employee_id: empSuperadmin.id, period_year: 2026, period_month: 8 } },
      update: {},
      create: {
        employee_id: empSuperadmin.id, period_year: 2026, period_month: 8,
        hadir: 22, status_hadir: 'Terpenuhi',
      }
    });

    // 17. TRANSPORT ALLOWANCE SETTINGS
    const existingSetting = await prisma.transportAllowanceSetting.findFirst();
    if (!existingSetting) {
      await prisma.transportAllowanceSetting.create({
        data: {
          base_fare: 5000, min_km: 5, max_km: 25, effective_start: new Date('2026-01-01'), created_by: userSuperadmin.id
        }
      });
    }

    // 18. TRANSPORT ALLOWANCE PERIODS
    const period = await prisma.transportAllowancePeriod.upsert({
      where: { period_year_period_month: { period_year: 2026, period_month: 8 } },
      update: {},
      create: {
        period_year: 2026, period_month: 8, total_recipients: 1,
        total_amount: 1760000, status: PeriodStatus.CALCULATED,
        calculated_by: userSuperadmin.id, calculated_at: new Date()
      }
    });

    // 19. TRANSPORT ALLOWANCE DETAILS (for Superadmin)
    await prisma.transportAllowanceDetail.upsert({
      where: { period_id_employee_id: { period_id: period.id, employee_id: empSuperadmin.id } },
      update: {},
      create: {
        period_id: period.id, employee_id: empSuperadmin.id, base_fare: 5000,
        original_km: 15.5, rounded_km: 16, attendance_days: 22,
        nominal: 1760000, eligibility_status: 'ELIGIBLE',
      }
    });

    // 20. ACTIVITY LOGS
    await prisma.activityLog.create({
      data: {
        user_id: userSuperadmin.id, module_code: 'MOD_USER', action: ActionType.LOGIN,
        description: 'User berhasil login', ip_address: '127.0.0.1', user_agent: 'PostmanRuntime/7.32.3'
      }
    });

    console.log('✅ All 20 tables successfully seeded, including Manager HRD and Admin HRD users!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    if (!prismaExternal) await prisma.$disconnect();
  }
}
