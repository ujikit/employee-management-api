import {
  AttendanceStatus,
  AttendanceType,
  EmployeeStatus,
  EmploymentType,
  ImportStatus,
  PeriodStatus,
  PositionType,
  PrismaClient, Scope,
  UserStatus
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

    // 3. ROLE PERMISSIONS 
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
    const deptHrd = await prisma.department.upsert({
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

    // 6. REGIONS (Province -> Regency -> District)
    const provinceDIY = await prisma.province.upsert({
      where: { code: 'DIY' }, update: {}, create: { code: 'DIY', name: 'Daerah Istimewa Yogyakarta' }
    });
    const regencySleman = await prisma.regency.upsert({
      where: { code: 'SLM' }, update: {}, create: { code: 'SLM', name: 'Sleman', province_id: provinceDIY.id }
    });
    const districtDepok = await prisma.district.upsert({
      where: { code: 'DPK' }, update: {}, create: { code: 'DPK', name: 'Depok', regency_id: regencySleman.id }
    });

    // 7. EMPLOYEES
    const emp1 = await prisma.employee.upsert({
      where: { nip: '123456789' },
      update: {},
      create: {
        nip: '123456789', name: 'John Doe', email: 'john.doe@company.com', phone: '+6281234567890',
        birth_place: 'Yogyakarta', birth_date: new Date('1990-01-01'), marital_status: 'kawin',
        children_count: 1, joined_at: new Date('2022-01-01'), employment_type: EmploymentType.PKWTT,
        gender: 'Laki-laki', distance_km: 15.5, full_address: 'Jl. Kaliurang KM 5',
        position_id: posMgr.id, department_id: deptHrd.id, district_id: districtDepok.id, status: EmployeeStatus.ACTIVE
      }
    });

    const emp2 = await prisma.employee.upsert({
      where: { nip: '123456790' },
      update: {},
      create: {
        nip: '123456790', name: 'Jane Doe', email: 'jane.doe@company.com', phone: '+6281234567891',
        birth_place: 'Jakarta', birth_date: new Date('1992-05-15'), marital_status: 'kawin',
        children_count: 0, joined_at: new Date('2023-03-01'), employment_type: EmploymentType.PKWTT,
        gender: 'Perempuan', distance_km: 8.2, full_address: 'Jl. Gejayan',
        position_id: posMgr.id, department_id: deptHrd.id, district_id: districtDepok.id, status: EmployeeStatus.ACTIVE
      }
    });

    const emp3 = await prisma.employee.upsert({
      where: { nip: '123456791' },
      update: {},
      create: {
        nip: '123456791', name: 'Bob Smith', email: 'bob.smith@company.com', phone: '+6281234567892',
        birth_place: 'Bandung', birth_date: new Date('1995-10-20'), marital_status: 'tidak kawin',
        children_count: 0, joined_at: new Date('2024-01-15'), employment_type: EmploymentType.PKWTT,
        gender: 'Laki-laki', distance_km: 20.0, full_address: 'Jl. Magelang',
        position_id: posStaff.id, department_id: deptHrd.id, district_id: districtDepok.id, status: EmployeeStatus.ACTIVE
      }
    });

    const empFauzi = await prisma.employee.upsert({
      where: { nip: '11223344' },
      update: {},
      create: {
        nip: '11223344', name: 'Fauzi Tech', email: 'fauzi.tech@example.com', phone: '+6281234567890',
        birth_place: 'Yogyakarta', birth_date: new Date('1995-08-12'), marital_status: 'kawin',
        children_count: 1, joined_at: new Date('2024-01-15'), employment_type: EmploymentType.PKWTT,
        distance_km: 12.0, full_address: 'Jl. Kaliurang KM 5, Depok, Sleman',
        position_id: posMgr.id, department_id: deptHrd.id, district_id: districtDepok.id, status: EmployeeStatus.ACTIVE
      }
    });

    const empTess = await prisma.employee.upsert({
      where: { nip: '1012930213' },
      update: {},
      create: {
        nip: '1012930213', name: 'Tess Zaki', email: 'tess@gmail.com', phone: '+6288392328323',
        birth_place: 'sadsadas', birth_date: new Date('2026-08-06'), marital_status: 'kawin',
        children_count: 2, joined_at: new Date('2026-08-19'), employment_type: EmploymentType.PKWTT,
        distance_km: 3.0, full_address: '4',
        position_id: posMgr.id, department_id: deptHrd.id, district_id: districtDepok.id, status: EmployeeStatus.ACTIVE
      }
    });

    // 8. EMPLOYEE EDUCATIONS
    const educations = [
      { employee_id: emp1.id, education_level: 'S1', school_name: 'Universitas Gadjah Mada', graduation_year: 2012, sort_order: 0 },
      { employee_id: empFauzi.id, education_level: 'SMA', school_name: 'SMA Negeri 1 Yogyakarta', graduation_year: 2013, sort_order: 1 },
      { employee_id: empFauzi.id, education_level: 'S1', school_name: 'Universitas Gadjah Mada', graduation_year: 2017, sort_order: 2 },
      { employee_id: empTess.id, education_level: 's1', school_name: 'sdsdsd', graduation_year: 2026, sort_order: 1 },
    ];

    for (const edu of educations) {
      const exists = await prisma.employeeEducation.findFirst({
        where: { employee_id: edu.employee_id, education_level: edu.education_level }
      });
      if (!exists) {
        await prisma.employeeEducation.create({ data: edu });
      }
    }

    // 9. USERS
    const userSuperadmin = await prisma.user.upsert({
      where: { username: 'johndoe' },
      update: {},
      create: {
        username: 'johndoe', email: 'super@yopmail.com', name: 'John Doe',
        password: defaultPassword, role_id: roleSuperadmin!.id, employee_id: emp1.id, status: UserStatus.ACTIVE
      }
    });

    const userMgrHrd = await prisma.user.upsert({
      where: { username: 'janedoe' },
      update: {},
      create: {
        username: 'janedoe', email: 'manager@yopmail.com', name: 'Jane Doe',
        password: defaultPassword, role_id: roleMgrHrd!.id, employee_id: emp2.id, status: UserStatus.ACTIVE
      }
    });

    const userAdmHrd = await prisma.user.upsert({
      where: { username: 'bobsmith' },
      update: {},
      create: {
        username: 'bobsmith', email: 'admin@yopmail.com', name: 'Bob Smith',
        password: defaultPassword, role_id: roleAdmHrd!.id, employee_id: emp3.id, status: UserStatus.ACTIVE
      }
    });

    // 10. TRANSPORT ALLOWANCE SETTINGS
    const existingSetting = await prisma.transportAllowanceSetting.findFirst();
    if (!existingSetting) {
      await prisma.transportAllowanceSetting.create({
        data: {
          base_fare: 5000, min_km: 5, max_km: 25, effective_start: new Date('2026-01-01'),
          is_active: true, created_by: userSuperadmin.id
        }
      });
    }

    // 11. TRANSPORT ALLOWANCE PERIODS & DETAILS
    const periodJuly2026 = await prisma.transportAllowancePeriod.upsert({
      where: { period_year_period_month: { period_year: 2026, period_month: 7 } },
      update: {},
      create: {
        period_year: 2026, period_month: 7, total_recipients: 1, total_amount: 1900000,
        status: PeriodStatus.CALCULATED
      }
    });

    const allowanceDetails = [
      { period_id: periodJuly2026.id, employee_id: emp1.id, base_fare: 5000, original_km: 15.5, rounded_km: 16, attendance_days: 16, nominal: 0, eligibility_status: 'INELIGIBLE' },
      { period_id: periodJuly2026.id, employee_id: emp2.id, base_fare: 5000, original_km: 8.2, rounded_km: 8, attendance_days: 18, nominal: 0, eligibility_status: 'INELIGIBLE' },
      { period_id: periodJuly2026.id, employee_id: emp3.id, base_fare: 5000, original_km: 20.0, rounded_km: 20, attendance_days: 19, nominal: 1900000, eligibility_status: 'ELIGIBLE' }
    ];

    for (const detail of allowanceDetails) {
      await prisma.transportAllowanceDetail.upsert({
        where: { period_id_employee_id: { period_id: detail.period_id, employee_id: detail.employee_id } },
        update: {},
        create: detail
      });
    }

    // 12. ATTENDANCE IMPORTS & SUMMARIES
    const importLog = await prisma.attendanceImport.create({
      data: {
        user_id: userAdmHrd.id, original_filename: 'manual_import_2026_7.json',
        period_year: 2026, period_month: 7, status: ImportStatus.COMPLETED,
        total_rows: 57, processed_rows: 57, finished_at: new Date('2026-08-13T06:55:49.560Z')
      }
    });

    await prisma.attendanceSummary.upsert({
      where: { employee_id_period_year_period_month: { employee_id: emp1.id, period_year: 2026, period_month: 8 } },
      update: {},
      create: {
        employee_id: emp1.id, period_year: 2026, period_month: 8,
        hadir: 22, status_hadir: 'Terpenuhi',
      }
    });

    // 13. REPRESENTATIVE ATTENDANCES (July 2026 Sample)
    const attendances = [
      { empId: emp1.id, date: '2026-07-01', type: AttendanceType.IZIN, status: AttendanceStatus.TERPENUHI, checkIn: '01:15:00', remarks: 'Absensi di Gedung Utama' },
      { empId: emp1.id, date: '2026-07-02', type: AttendanceType.HADIR, status: AttendanceStatus.TERPENUHI, checkIn: '01:00:00', remarks: 'Datang tepat waktu' },
      { empId: emp2.id, date: '2026-07-01', type: AttendanceType.HADIR, status: AttendanceStatus.TERPENUHI, checkIn: '01:00:00', remarks: 'Datang tepat waktu' },
      { empId: emp3.id, date: '2026-07-01', type: AttendanceType.HADIR, status: AttendanceStatus.TERPENUHI, checkIn: '01:15:00', remarks: 'Absensi di Gedung B' }
    ];

    for (const att of attendances) {
      await prisma.attendance.upsert({
        where: { employee_id_attendance_date: { employee_id: att.empId, attendance_date: new Date(att.date) } },
        update: {},
        create: {
          employee_id: att.empId, attendance_import_id: importLog.id, attendance_date: new Date(att.date),
          checkin_at: new Date(`${att.date}T${att.checkIn}.000Z`), checkout_at: new Date(`${att.date}T10:00:00.000Z`),
          checkin_location: 'Gedung Utama', checkout_location: 'Gedung Utama', attendance_type: att.type,
          duration_hours: 9, status: att.status, verified_by_role: 'HRD', remarks: att.remarks
        }
      });
    }

    console.log('✅ Database seeded successfully based on provided SQL snapshot!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    if (!prismaExternal) await prisma.$disconnect();
  }
}