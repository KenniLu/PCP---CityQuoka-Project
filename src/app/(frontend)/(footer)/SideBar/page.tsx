const SideBar = () => {
    return (
        <>
        <div className="w-64 h-screen p-6 bg-quokka-yellow text-black shadow-lg">
            <ul className="mt-2">    
                <li className="pb-5"><a href="#" className="text-xl hover:text-orange-100 duration-500">About us</a></li>
                <li className="pb-5"><a href="#" className="text-xl hover:text-orange-100 duration-500">Contact us</a></li>
                <li className="pb-5"><a href="#" className="text-xl hover:text-orange-100 duration-500">Term of use</a></li>
                <li className="pb-5"><a href="#" className="text-xl hover:text-orange-100 duration-500">Private Policy</a></li>
                <li className="pb-5"><a href="#" className="text-xl hover:text-orange-100 duration-500">Cookies</a></li>
            </ul>
        </div>
        </>
    );
};

export default SideBar;