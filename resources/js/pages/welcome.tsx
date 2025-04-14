import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full flex-col max-w-[335px] lg:max-w-4xl">
                        <div className="pb-8 flex items-center flex-col space-y-5 justify-center space-x-3">
                            <h1 className="text-3xl font-semibold dark:text-neutral-100">Shoutbox Chat Example App</h1>
                            <a href="https://github.com/thedevdojo/guild" target="_blank" className="inline-flex items-center px-4 py-2 mt-4 text-sm font-bold text-gray-100 dark:text-gray-800 hover:text-white bg-gray-800 dark:bg-gray-100 border-0 rounded-xl cursor-pointer focus:outline-none hover:bg-gray-900 md:mt-0">
                                <svg className="w-6 h-6 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z" stroke="none"></path><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"></path></svg>
                                <span className="md:inline hidden">View Project on</span><span className="mx-1">Github</span>
                            </a>
                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl  p-1.5 flex items-center">
                                <nav className="flex items-center justify-end gap-2">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            View Live Demo
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="inline-block rounded-sm border border-[#19140035] bg-white dark:bg-neutral-700 px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </div>
                        <img src="/screenshot.png" className="w-full h-auto rounded-lg" alt="Shoutbox Screenshot" />
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
