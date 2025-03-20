const SideBar = () => {
    return (
        <>
        <div className="text-left w-64 h-screen p-6 flex flex-col bg-quokka-yellow text-black shadow-lg">
            <ul>    
                <li><a href="#" className="text-xl hover:text-orange-100 duration-500 py-4">About us</a></li>
                <li><a href="#" className="text-xl hover:text-orange-100 duration-500">Contact us</a></li>
                <li><a href="#" className="text-xl hover:text-orange-100 duration-500">Term of use</a></li>
                <li><a href="#" className="text-xl hover:text-orange-100 duration-500">Private Policy</a></li>
                <li><a href="#" className="text-xl hover:text-orange-100 duration-500">Cookies</a></li>
            </ul>
        </div>
        </>
    );
};

export default SideBar;