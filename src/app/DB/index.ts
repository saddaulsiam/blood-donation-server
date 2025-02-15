import { UserRole, UserStatus } from "@prisma/client";
import config from "../../config";
import prisma from "../../shared/prisma";

const admin = {
  name: config.admin.admin_name as string,
  email: config.admin.admin_email as string,
  password: config.admin.admin_password as string,
  phoneNumber: config.admin.admin_phone_number as string,
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
};

const seedAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isAdminExits = await prisma.user.findUnique({
    where: { email: admin.email, role: UserRole.ADMIN },
  });

  if (!isAdminExits) {
    await prisma.user.create({ data: admin });
  }
};

export default seedAdmin;
