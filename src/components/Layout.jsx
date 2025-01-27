import React, { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Cases', href: '/cases' },
  { name: 'Settings', href: '/settings' },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ClusterBuster</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          clsx(
                            isActive
                              ? 'border-indigo-500 text-gray-900 dark:text-white'
                              : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-200'
                          : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
