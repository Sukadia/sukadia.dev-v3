export default function Loading() {

    return (
      <div className="flex h-screen justify-center items-center">
        <div className="flex items-center justify-center rounded-full w-14 h-14 bg-gradient-to-tr from-cyan-400 to-blue-900 animate-spin">
          <div className="h-10 w-10 rounded-full bg-black"></div>
        </div>
      </div>
    )
  }