import Link from "next/link";

export default function Home() {
  return (
    <div
      className="text-gray-900 flex flex-col items-center h-screen
    w-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
    from-[#b7d4f4] via-[#f4f7fa] to-[#ffffff]"
    >
      <div
        className="justify-center 
    flex flex-col p-6 h-full w-[80rem] max-w-full"
      >
        <div className="font-bold text-2xl">uploadstuff</div>
        <div className="flex-grow flex justify-center items-center flex-col">
          <div className="max-w-2xl text-center flex gap-y-8 flex-col">
            <h1 className="text-4xl sm:text-5xl font-bold">
              File Uploads For All Developers
            </h1>
            <div className="text-gray-600">
              Building an AI app? Don't waste your time on implementing file
              upload.
            </div>
            <div>
              <Link
                href="/introduction"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm
              font-semibold text-white shadow-sm hover:bg-blue-500
              focus-visible:outline
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-blue-600"
              >
                Read docs
              </Link>
            </div>
          </div>
        </div>
        <div className="h-[2rem] block"></div>
      </div>
    </div>
  );
}
