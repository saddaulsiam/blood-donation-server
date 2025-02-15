import { UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";

const seedAdmin = async () => {
  const admin = {
    name: process.env.ADMIN_NAME!,
    email: process.env.ADMIN_EMAIL!,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10),
    phoneNumber: process.env.ADMIN_PHONE_NUMBER!,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  };

  //when database is connected, we will check is there any user who is admin
  const isAdminExits = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL, role: UserRole.ADMIN },
  });

  if (!isAdminExits) {
    await prisma.user.create({ data: admin });
  }
};

export default seedAdmin;
