import { Dispatch, SetStateAction, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import SecondaryButton from './SecondaryButton'

// pure JavaScript notation
const StreamQuery = require('sparql-http-client')

// Not used afterwards
const SparqlClient = require('sparql-http-client')

export interface IExampleData {
  id: number
  value: string
}

interface ISqueryPanelProps {
  isVisible: string
  changeSqueryVisibility: Dispatch<SetStateAction<string>>
}

export default function SQueryPanel({
  isVisible,
  changeSqueryVisibility,
}: ISqueryPanelProps) {
  const [data, setData] = useState<IExampleData[]>([])

  const [demolitionYear, setDemolitionYear] = useState('')

  const nodeRef = useRef(null)

  const closeSQueryPanel = () => {
    changeSqueryVisibility('none')
  }

  const handleClick = async () => {
    const endpointUrl = 'http://localhost:3030/test/query'

    // Select all walls with a material IfcMaterial_243
    const query = `
                    PREFIX ifcowl:  <http://ifcowl.openbimstandards.org/IFC2X3_TC1#>
                    PREFIX inst:  <http://linkedbuildingdata.net/ifc/resources20160607_145724/>
                    PREFIX list:  <https://w3id.org/list#>
                    PREFIX express:  <https://w3id.org/express#>
                    PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                    PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
  
                    SELECT ?object ?materialtype
                    WHERE {
                      ?connection ifcowl:relatedObjects_IfcRelAssociates  ?object .
                      ?connection ifcowl:relatingMaterial_IfcRelAssociatesMaterial  inst:IfcMaterial_243.
                      inst:IfcMaterial_243  ifcowl:name_IfcMaterial  inst:IfcLabel_714874 .
                       inst:IfcLabel_714874  express:hasString  ?materialtype .
                    }
                  `

    // const client = new SparqlClient({ endpointUrl })
    // const stream = await client.query.select(query)
    const client = new StreamQuery({ endpointUrl })
    const stream = await client.query.select(query, {
      headers: { 'Content-Type': 'application/sparql-query' },
      operation: 'postDirect',
    })

    // console.log(stream);
    let result = new Array<IExampleData>()
    let index = 0

    //@ts-ignore
    stream.on('data', (row) => {
      console.log(1)
      result.push({ id: index, value: row.materialtype.value })
      let temp: IExampleData = { id: index, value: row.materialtype.value }
      // console.log(row)
      // console.log(row.materialtype.value)
      // console.log(row.value.value)
      // console.log(row.height.value)
    })
    console.log(2)
    setData(result)

    //@ts-ignore
    stream.on('error', (err) => {
      console.error(err)
    })
  }

  const onInputChange = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name
    const value = event.target.value

    console.log(value)

    // setInsufficientBalance(false);

    if (name === 'tokenXAmount') {
      // setTokenXAmount(value);
    } else {
      // setTokenYAmount(value);
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '30%',
        left: '30%',
        right: 0,
        bottom: 0,
        width: '500px',
        display: isVisible,
      }}
    >
      <Draggable nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          className="block w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex justify-between">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">
              Standard Queries
            </h5>
            <button
              onClick={closeSQueryPanel}
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              className="inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="mt-6 flex justify-between">
            <h5 className="text-m flex items-center justify-center tracking-tight text-gray-900">
              Demolition in year
            </h5>
            <input
              type="text"
              id="year"
              className="block w-32 rounded-lg border border-gray-300 bg-gray-50 text-sm 
                text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="2020"
              pattern="[0-9]*"
              value={demolitionYear}
              onChange={(e) =>
                setDemolitionYear((v) =>
                  e.target.validity.valid ? e.target.value : v
                )
              }
            />
            <div>
              <SecondaryButton onClick={() => console.log('Query #1')}>
                Query #1
              </SecondaryButton>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div>01</div>
            <div>
              <SecondaryButton onClick={() => console.log('Query #2')}>
                Query #2
              </SecondaryButton>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div>01</div>
            <div>
              <SecondaryButton onClick={() => console.log('Query #3')}>
                Query #3
              </SecondaryButton>
            </div>
          </div>

          {data.length !== 0 && (
            <div>
              {data.map((value, index) => (
                <p>
                  {value.id} {value.value}
                </p>
              ))}
            </div>
          )}
        </div>
      </Draggable>
    </div>
  )
}
