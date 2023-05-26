import AdminNavBar from "@/components/AdminNavBar";
import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import { getAdminToken } from "@/utils/getAdminToken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { setAdminToken } from "@/utils/setAdminToken";

function UserDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [allEventsData, setAllEventsData] = useState([]);
  const adminIdCookie = getAdminToken();
  const [popupFilterOpen, setPopupFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    keyword: "",
    category: "",
    college: "",
    dateRange: "",
    price: [10, 3000],
  });
  const [originalEvents, setOriginalEvents] = useState([]);

  const fetchAllEventsData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/getallevents`
    );
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    try {
      const data = await response.json();
      setAllEventsData(data);
    } catch (error) {
      console.error("Invalid JSON string:", error.message);
    }
  };

  useEffect(() => {
    fetchAllEventsData();
  }, []);

  console.log(allEventsData);
  // dont move this state becoz it needs allevents
  const [filteredEvents, setFilteredEvents] = useState(allEventsData);

  // Update filteredEvents state whenever allEvents or filterOptions change
  useEffect(() => {
    const newFilteredEvents = allEventsData.filter((event) => {
      console.log("speciifc event");
      console.log(event);
      // Check if keyword filter matches
      if (
        filterOptions.keyword.toLowerCase() &&
        !event.name.toLowerCase().includes(filterOptions.keyword.toLowerCase())
      ) {
        return false;
      }
      if (
        filterOptions.category.toLowerCase() &&
        !(event.category.toLowerCase() === filterOptions.category.toLowerCase())
      ) {
        return false;
      }

      if (
        filterOptions.college.toLowerCase() &&
        !(event.college.toLowerCase() === filterOptions.college.toLowerCase())
      ) {
        return false;
      }

      // Check if date range filter matches
      if (filterOptions.dateRange) {
        const date = filterOptions.dateRange;
        // Split the date string into an array of substrings
        const dateParts = event.date.split("/");
        // Rearrange the array elements to get yyyy-mm-dd format
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        if (formattedDate < date) {
          return false;
        }
      }

      // Check if price filter matches
      if (
        event.price < filterOptions.price[0] ||
        event.price > filterOptions.price[1]
      ) {
        return false;
      }

      return true;
    });

    setFilteredEvents(newFilteredEvents);
  }, [allEventsData, filterOptions]);

  const handleFilterClear = () => {
    setFilterOptions({
      keyword: "",
      category: "",
      dateRange: "",
      price: [10, 3000],
    });
    setFilteredEvents(allEventsData);
    setPopupFilterOpen(false);
  };
  useEffect(() => {
    // Check if at least one event has admin_id equal to local adminCookie
    const hasAdmin = filteredEvents.some(
      (event) => event.admin_id === adminIdCookie
    );
    setIsAdmin(hasAdmin);
  }, [filteredEvents, adminIdCookie]);
  console.log(adminIdCookie);
  console.log(isAdmin);
  return (
    <div className="pt-20 lg:pt-8 overflow-y-hidden bg-[color:var(--primary-color)]">
      <AdminNavBar />
      <div className="flex m-auto">
        <div className="flex mx-auto container ">
          <div className="flex m-auto gap-4 lg:gap-8 overflow-y-hidden w-full h-[calc(88vh)]">
            {/* Render the regular filter for medium screens and above */}
            <div className="hidden md:flex flex-col p-4 sticky top-0 w-1/6 md:w-1/4">
              <Dashboard_Filter
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                handleFilterClear={handleFilterClear}
              />
            </div>
            {/* Render the popup filter for small screens */}
            {popupFilterOpen && (
              <div className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 w-5/6">
                  <Popup_Filter
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    handleFilterClear={handleFilterClear}
                    handleClose={() => setPopupFilterOpen(false)}
                  />
                </div>
              </div>
            )}
            {/* Render the main content of the dashboard */}
            <div className="flex w-full md:w-3/4 mx-auto justify-between container">
              <div className="p-4 overflow-y-auto w-full h-[calc(80vh)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredEvents.length === 0 || !isAdmin ? (
                    <p>No events yet</p>
                  ) : (
                    filteredEvents.map((event) =>
                      event.admin_id !== adminIdCookie ? (
                        <></>
                      ) : (
                        <div
                          onClick={() => {
                            router.push(`/event/${event.event_id}/adminevents`);
                          }}
                          className="mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
                          key={event._id}
                        >
                          <div className="relative h-[25rem]">
                            {event.profile && (
                              <Image
                                fill
                                className="object-cover h-full w-full rounded-md"
                                src={event.profile}
                                alt=""
                                sizes="(min-width: 640px) 100vw, 50vw"
                                priority
                              />
                            )}
                          </div>
                          <div className="flex flex-row justify-between items-start mt-4">
                            <div className="px-2">
                              <p className="text-sm text-gray-800 font-bold">
                                {event.name.length > 30
                                  ? event.name.slice(0, 30) + "..."
                                  : event.name}
                              </p>

                              <p className="text-sm text-gray-800">
                                {event.venue}
                              </p>

                              <p className="text-sm text-gray-800">
                                {event.date}
                              </p>
                            </div>
                            {/* Star component */}
                            <div className="flex flex-col justify-end items-center">
                              <span className="w-full flex flex-row items-center">
                                <FaUsers />

                                {allEventsData.map((eve) => {
                                  if (eve.event_id === event.event_id) {
                                    return (
                                      <span className="ml-2 text-sm">
                                        {eve.participants.length}
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                              </span>
                              <p className="text-sm text-gray-800 mt-2">
                                <strong className="whitespace-nowrap">
                                  ₹ {event.price}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
            {/* Bottom buttons */}
            <div className="fixed bottom-3 right-3">
              {/* Button to open the popup filter */}
              <button
                onClick={() => setPopupFilterOpen(true)}
                className="md:hidden flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
                title="Filter Events"
              >
                <RxHamburgerMenu className="w-6 h-6" />
              </button>
              {/* Button to open the event form */}
              <button
                onClick={() => router.push("/admin/eventForm")}
                className="mt-4 flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
                title="Create Events"
              >
                <AiOutlinePlus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
