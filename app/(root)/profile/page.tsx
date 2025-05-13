import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  const organizedEvents = await getEventsByUser({ userId, page: 1 });

  return (
    <>
      {/* {tiket user} */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild>
            <Link href="/#events" className="button hidden sm:flex">
              Explore more events
            </Link>
          </Button>
        </div>
      </section>

      {/* <section className="wrapper my-8">
        <Collection
          data={events?.data}
          emptyTitle="No Events tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          totalPages={2}
          urlParamName="orderPage"
        />
      </section> */}

      {/* {buat event - hanya untuk admin} */}
      {role === "admin" && (
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center sm:text-left">
              Event Organized
            </h3>
            <Button asChild>
              <Link href="/events/create" className="button hidden sm:flex">
                Create new event
              </Link>
            </Button>
          </div>
        </section>
      )}
      {role === "admin" && (
        <section className="wrapper my-8">
          <Collection
            data={organizedEvents?.data}
            emptyTitle="No Events have ben created yet"
            emptyStateSubtext="Go create some now"
            collectionType="Events_Organized"
            limit={6}
            page={1}
            totalPages={2}
            urlParamName="orderPage"
          />
        </section>
      )}
    </>
  );
};

export default ProfilePage;
