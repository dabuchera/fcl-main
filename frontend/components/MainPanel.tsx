import { Dispatch, SetStateAction, useState } from 'react'
import Auth from './Auth'
import SecondaryButton from './SecondaryButton'

// pure JavaScript notation
const StreamQuery = require('sparql-http-client')

// Not used afterwards
const SparqlClient = require('sparql-http-client')

export interface IExampleData {
  id: number
  value: string
}

interface IMainPanelProps {
  changeSqueryVisibility: Dispatch<SetStateAction<string>>
}

export default function MainPanel({changeSqueryVisibility}: IMainPanelProps) {
  const [data, setData] = useState<IExampleData[]>([])

  const handleClickTest = () => {
    changeSqueryVisibility('block')
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        right: 0,
        bottom: 0,
        width: '500px',
      }}
    >
      <div className="block w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <Auth />
        <h5 className="mt-6 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          The CFC Platform
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 mb-10">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
        {data.length !== 0 && (
          <div>
            {data.map((value, index) => (
              <p>
                {value.id} {value.value}
              </p>
            ))}
          </div>
        )}
        <SecondaryButton onClick={handleClickTest}>Standard Queries</SecondaryButton>
      </div>
    </div>
  )
}
