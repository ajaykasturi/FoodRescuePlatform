const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-green-100 to-emerald-200 py-12 px-4 sm:px-6 lg:px-8 rounded-t-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-8 sm:space-y-0">
          {/* Footer Logo */}
          <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">FR</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a href="#" className="text-lg hover:text-gray-600">
              Privacy policy
            </a>
            <a href="#" className="text-lg hover:text-gray-600">
              Terms & Conditions
            </a>
            <a href="#" className="text-lg hover:text-gray-600">
              Contact us
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-green-700">
            © Food Recue Platform, 2025 - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
