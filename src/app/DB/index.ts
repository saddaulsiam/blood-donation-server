import { UserRole, UserStatus } from "@prisma/client";
import config from "../../config";
import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";

const seedAdmin = async () => {
  const admin = {
    name: config.admin.admin_name as string,
    email: config.admin.admin_email as string,
    password: await bcrypt.hash(config.admin.admin_password as string, 12),
    phoneNumber: config.admin.admin_phone_number as string,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  };

  //when database is connected, we will check is there any user who is admin
  const isAdminExits = await prisma.user.findUnique({
    where: { email: admin.email, role: UserRole.ADMIN },
  });

  if (!isAdminExits) {
    await prisma.user.create({ data: admin });
  }
};

export default seedAdmin;
