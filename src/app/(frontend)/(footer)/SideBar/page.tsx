import { PathActivatedLink } from '@/components/PathActivatedLink'
import Link from 'next/link'
const SideBar = () => {
    return (
        <>
        <div className="w-64 h-screen p-6 bg-quokka-yellow text-black shadow-lg">
            <ul className="mt-2 flex flex-col gap-2">   
                <li className="pb-5">   
                    <Link href="/">
                    <button   
                        className={`text-2xl hover:text-gray-900 duration-500 text-white`}
                    >
                        <PathActivatedLink pathMatch="/" exactMatch={true}>Home</PathActivatedLink>
                    </button>
                    </Link>
                </li>
                
                <li className="pb-5">   
                    <Link href="/about-us">
                    <button   
                        className={`text-xl hover:text-orange-100 duration-500`}
                    >
                        <PathActivatedLink pathMatch="/about-us" exactMatch={false}>About Us</PathActivatedLink>
                    </button>
                    </Link>
                </li>

                <li className="pb-5">  
                    <Link href="/contact-us">
                    <button
                        className={`text-xl hover:text-orange-100 duration-500`}
                    >
                        <PathActivatedLink pathMatch="/contact-us" exactMatch={false}>Contact Us</PathActivatedLink>
                    </button>
                    </Link>
                </li>

                <li className="pb-5">  
                    <Link href="/cookies">
                    <button
                        className={`text-xl hover:text-orange-100 duration-500`}
                    >
                        <PathActivatedLink pathMatch="/cookies" exactMatch={false}>Cookies</PathActivatedLink>
                    </button>
                    </Link>
                </li>

                <li className="pb-5">  
                    <Link href="/term-of-use">
                    <button
                        className={`text-xl hover:text-orange-100 duration-500`}
                    >
                        <PathActivatedLink pathMatch="/term-of-use" exactMatch={false}>Term of Use</PathActivatedLink>
                    </button>
                    </Link>
                </li>

                <li className="pb-5">  
                    <Link href="/private-policy">
                    <button
                        className={`text-xl hover:text-orange-100 duration-500`}
                    >
                        <PathActivatedLink pathMatch="/private-policy" exactMatch={false}>Private Policy</PathActivatedLink>
                    </button>
                    </Link>
                </li>
      
            </ul>
        </div>
        </>
    );
};

export default SideBar;