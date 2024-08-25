"use server";

import db from "@/utils/db";
import { Prisma } from "@prisma/client";
import {
  CreateAndEditJobSchema,
  CreateAndEditJobType,
  JobStatus,
  JobType,
} from "./types";
import { auth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { count } from "console";

///////////////////////////////////////////////////////////////////////////////////

async function authenticateAndRedirect(): Promise<string> {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return userId;
}

///////////////////////////////////////////////////////////////////////////////////

export async function CreateJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();

  try {
    CreateAndEditJobSchema.parse(values);
    const job = await db.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });

    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

///////////////////////////////////////////////////////////////////////////////////

type GetAllJobsProps = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export async function GetAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsProps): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = await authenticateAndRedirect();
  const skip = (page - 1) * limit;

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
          {
            location: {
              contains: search,
            },
          },
        ],
      };
    }
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const jobs: JobType[] = await db.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count: number = await db.job.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(count / limit);

    // console.log({ count, page, totalPages });

    return { jobs, count, page, totalPages };
  } catch (error) {
    console.error(error);
    return { jobs: [], count: 0, page: 0, totalPages: 0 };
  }
}

///////////////////////////////////////////////////////////////////////////////////

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();

  try {
    const job: JobType = await db.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}

///////////////////////////////////////////////////////////////////////////////////

export async function GetSingleJobAction(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();
  let job: JobType | null = null;
  try {
    job = await db.job.findUnique({
      where: {
        clerkId: userId,
        id,
      },
    });
  } catch (error) {
    job = null;
  }

  if (!job) {
    redirect("/jobs");
  }
  return job;
}

///////////////////////////////////////////////////////////////////////////////////

export async function UpdateJobAction(
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();
  console.log(userId);

  try {
    const job: JobType = await db.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}

///////////////////////////////////////////////////////////////////////////////////

export async function GetStatsAction(): Promise<{
  pending: number;
  interview: number;
  offer: number;
  declined: number;
}> {
  const userId = await authenticateAndRedirect();

  try {
    const stats = await db.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId,
      },
    });

    const statusObj = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const defaultStatus = {
      pending: 0,
      interview: 0,
      offer: 0,
      declined: 0,
      ...statusObj,
    };

    return defaultStatus;
  } catch (error) {
    redirect("/jobs");
  }
}

///////////////////////////////////////////////////////////////////////////////////

export async function GetChartDataAction(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = await authenticateAndRedirect();
  const eightMonths = dayjs().subtract(7, "month").toDate();
  try {
    const jobs = await db.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: eightMonths,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format("MMM YY");

      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, [] as Array<{ date: string; count: number }>);

    // console.log(applicationsPerMonth);

    return applicationsPerMonth;
  } catch (error) {
    redirect("/jobs");
  }
}
