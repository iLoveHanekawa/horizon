export const IconTray: React.FC = () => {
    return <section className="mt-10 w-content-lg text-gray-400">
    <div className="border-b-xs border-gray-800 pb-2 font-extrabold uppercase text-sm text-gray-200">Social handles</div>
    <ul className="mt-3 flex gap-4">
        <a href='https://www.github.com/ilovehanekawa/' target="_blank" className="flex gap-2 text-gray-400 hover:text-white transition-colors duration-300 items-center">
        <i className="fa-brands fa-github text-lg"></i>
        <span>Github</span>
        </a>
        <a href="https://www.instagram.com/arjun.tsx/" target="_blank" className="flex gap-2 text-gray-400 hover:text-white transition-colors duration-300 items-center">
            <i className="fa-brands fa-instagram text-lg"></i>
            <span>Instagram</span>
        </a>
        <a href="https://www.discordapp.com/users/688751829324136511" target="_blank" className="flex gap-2 text-gray-400 hover:text-white transition-colors duration-300 items-center">
            <i className="fa-brands fa-discord text-lg"></i>
            <span>Discord</span>
        </a>
    </ul>
  </section>
}