import { useRouter } from "next/router";

function Header() {
  const router = useRouter();

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Desktop navigation */}
          <nav className="flex grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <a
                  onClick={() => router.push("/admin/auth")}
                  className="btn text-white bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] w-full mb-4 sm:w-auto sm:mb-0 sm:mr-4"
                >
                  Login as Admin
                </a>
              </li>
            </ul>
            <div>
              <a
                href="/users/signin"
                className="btn text-white bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] w-full mb-4 sm:w-auto sm:mb-0"
              >
                Signin
              </a>
            </div>
            <div>
              <a
                className="btn text-white bg-gray-700 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                href="/users/signup"
              >
                Signup
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
