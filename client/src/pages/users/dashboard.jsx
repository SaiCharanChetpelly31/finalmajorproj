import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import UserNavBar from "@/components/UserNavBar";
import Image from "next/image";
import { useRouter } from "next/router";
import { getUserToken } from "@/utils/getUserToken";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

function UserDashboard() {
  const userIdCookie = getUserToken();
  const router = useRouter();
  const picRatio = 0.606;

  const [allEvents, setAllEvents] = useState([]);
  const [allEventsData, setAllEventsData] = useState([]);
  const [popupFilterOpen, setPopupFilterOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    keyword: "",
    category: "",
    college:"",
    dateRange: "",
    price: [10, 3000],
  }); 

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

  // fetch the user data as soon as the page loads
  const fetchUserData = async () => {
    // If cookie was manually removed from browser
    if (!userIdCookie) {
      console.error("No cookie found! Please signin");
      // redirect to signin
      router.push("/users/signin");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_token: userIdCookie,
        }),
      }
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

    // User Details fetched from API `/user/details`
    try {
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Invalid JSON string:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  // dont move this state becoz it needs allevents
  const [filteredEvents, setFilteredEvents] = useState(allEventsData);

  // Update filteredEvents state whenever allEvents or filterOptions change
  useEffect(() => {
    const newFilteredEvents = allEventsData.filter((event) => {
      console.log('specific event')
      console.log(event)
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
  console.log("filtered events")
console.log(filteredEvents)
  const handleFilterClear = () => {
    setFilterOptions({
      keyword: "",
      category: "",
      college:"",
      dateRange: "",
      price: [10, 3000],
    });
    setFilteredEvents(allEventsData);
    setPopupFilterOpen(false);
  };
  console.log(filteredEvents);
  console.log("userdata");
  console.log(userData);
  return (
    <div className="pt-20 lg:pt-8 overflow-y-hidden bg-[color:var(--primary-color)]">
      <UserNavBar />
      <div className="flex m-auto">
        <div className="flex mx-auto container ">
          <div className="flex m-auto overflow-y-hidden gap-4 lg:gap-8 w-full h-[calc(88vh)]">
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
                <h2 className="text-lg font-medium mb-4">Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredEvents.length === 0 ? (
                    <p>No events yet</p>
                  ) : (
                    filteredEvents.map((event) => (
                      <div
                        onClick={() => {
                          router.push(`/event/${event.event_id}`);
                        }}
                        className="hover:scale-105 cursor-pointer transition-all mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
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
                              <span className="ml-2 text-sm">
                                {event.participants.length}
                              </span>
                            </span>
                            <p className="text-sm text-gray-800 mt-2">
                              <strong className="whitespace-nowrap">
                                ₹ {event.price}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div>
                          {userData.registeredEvents?.filter(
                            (e) => e.event_id === event.event_id
                          ).length > 0 ? (
                            <button className="mt-4 bg-[color:green] text-white py-2 px-4 rounded hover:bg-[color:green]">
                              Registered
                            </button>
                          ) : (
                            <button className="mt-4 bg-[color:red] text-white py-2 px-4 rounded hover:bg-[color:red]">
                              Not Registered
                            </button>
                          )}
                        </div>
                      </div>
                    ))
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

