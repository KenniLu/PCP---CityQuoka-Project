
const Footer = () => {
    return (
        <footer>
        <div className="container mx-auto px-10 text-white relative w-full max-w-[1122px] pt-10 bg-black py-12">
            <div className="flex justify-between flex-col md:flex-row gap-4 w-full">
                <div className="flex flex-col w-full md:w-1/2">
                    {/* <h2 className="text-2xl font-bold mb-4">Logo</h2> */}
                    <a href = "/">
                        <img 
                            className="filter invert w-40 pb-7"
                            src="/city-quokka-email-label.png"
                            alt="logo"
                        />
                    </a>
                    {/* Media */}
                    <ul className="flex space-x-4 text-4xl pb-5">
                        <li>
                            <a href="#"> 
                                <i className="fa-brands fa-instagram"></i>
                            </a>   
                        </li> 
                        <li>
                            <a href="#"> 
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </li> 
                    </ul>
                    {/* Acknowledge of the country */}
                    <h2 className="text-1xl font-bold mb-4 pr-5">Acknowledgement of the Country</h2>
                    <p className="mb-4 pr-20">We acknowledge the traditional custodians of the land on which we live, work and play, and  pay respects to the 29 clans of the Eora Nation and all Elders past, present and emerging.</p>
                </div>
                <div className="flex flex-col w-full md:w-1/4">
                    <h2 className="text-2xl font-bold mb-4">Explore</h2>
                    <ul>
                        <li><a href="/about-us" className="hover:underline duration-500">About us</a></li>
                        <li><a href="#" className="hover:underline duration-500">Contact us</a></li>
                    </ul>
                </div>
                <div className="flex flex-col w-full md:w-1/4">
                    <h2 className="text-2xl font-bold mb-4">Learn More</h2>
                    <ul>
                        <li><a href="#" className="hover:underline duration-500">Term of use</a></li>
                        <li><a href="#" className="hover:underline duration-500">Cookies</a></li>
                        <li><a href="#" className="hover:underline duration-500">Private Policy</a></li>
                    </ul>
                </div>
            </div>
            <p className="text-zinc-50 mt-10">@ Copyright 2025 by City Quokka</p>

        </div>
        </footer>
    );
  };
  
  export default Footer;