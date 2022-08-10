import Auth from './Auth'

export default function Panel() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        right: 0,
        bottom: 0,
        width: '500px'
      }}
    >
      <div className="block w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Auth />
        <h5 className="mt-6 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          The CFC Platform
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
      </div>
    </div>
  )
}
