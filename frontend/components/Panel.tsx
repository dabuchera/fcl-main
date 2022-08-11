import { useState } from 'react'
import Auth from './Auth'

// pure JavaScript notation
const StreamQuery = require('sparql-http-client')

// Not used afterwards
const SparqlClient = require('sparql-http-client')

export interface IExampleData {
  id: number
  value: string
}

export default function Panel() {
  const [data, setData] = useState<IExampleData[]>([])

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
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
        <button
          style={{ width: '10px', height: '10px', backgroundColor: 'black' }}
          onClick={handleClick}
        ></button>
        {data.length !== 0 && (
          <div>
            {data.map((value, index) => <p>{value.id}  {value.value}</p>)}            
          </div>
        )}
      </div>
    </div>
  )
}
