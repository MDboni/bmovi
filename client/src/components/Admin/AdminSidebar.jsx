import React from 'react'
import { assets } from '../../assets/assets'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {

  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  }

  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Show', path: '/admin/add-show', icon: PlusSquareIcon },
    { name: 'List Show', path: '/admin/list-show', icon: ListIcon },
    { name: 'List Booking', path: '/admin/list-bookings', icon: ListCollapseIcon },
  ]

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      {/* Profile Section */}
      <img
        src={user.imageUrl}
        alt="profile"
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
      />
      <p className="mt-2 text-base max-md:hidden text-center">
        {user.firstName} {user.lastName}
      </p>

      {/* Navigation Links */}
      <div className="w-full mt-4">
        {adminNavlinks.map((link, index) => {
          const Icon = link.icon
          return (
            <NavLink
              key={index}
              end
              to={link.path}
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 md:pl-10 first:mt-6 text-gray-400 hover:text-primary transition-all duration-200 ${isActive ? 'bg-primary/15 text-primary group' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <p className="max-md:hidden">{link.name}</p>
                  <span
                    className={`w-1.5 h-10 rounded-l absolute right-0 ${isActive ? 'bg-primary' : ''
                      }`}
                  ></span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default AdminSidebar
