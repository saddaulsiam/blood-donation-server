import { UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../../shared/prisma";

const seedAdmin = async () => {
  const admin = {
    name: config.admin.admin_name as string,
    email: config.admin.admin_email as string,
    password: await bcrypt.hash("Siam420@$", 10),
    phoneNumber: config.admin.admin_phone_number as string,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  };

  //when database is connected, we will check is there any user who is admin
  const isAdminExits = await prisma.user.findUnique({
    where: { email: config.admin.admin_email, role: UserRole.ADMIN },
  });

  if (!isAdminExits) {
    await prisma.user.create({ data: admin });
  }
};

export default seedAdmin;
