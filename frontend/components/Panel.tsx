import Auth from './Auth'

// pure JavaScript notation
const StreamQuery = require('sparql-http-client')

// Not used afterwards
const SparqlClient = require('sparql-http-client')

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  // const endpointUrl = 'http://localhost:3030/ds/query';
  const endpointUrl = 'https://query.wikidata.org/sparql'

  const query = `
                  PREFIX wd: <http://www.wikidata.org/entity/>
                  PREFIX p: <http://www.wikidata.org/prop/>
                  PREFIX ps: <http://www.wikidata.org/prop/statement/>
                  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
                  
                  SELECT ?value WHERE {
                    wd:Q243 p:P2048 ?height.
                  
                    ?height pq:P518 wd:Q24192182;
                      ps:P2048 ?value .
                  }
                `

  const client = new SparqlClient({ endpointUrl })
  const stream = await client.query.select(query)

  //@ts-ignore
  stream.on('data', (row) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      console.log(`${key}: ${value.value} (${value.termType})`)
    })
  })

  //@ts-ignore
  stream.on('error', (err) => {
    console.error(err)
  })

  // const query = `
  //                   PREFIX cc: <http://creativecommons.org/ns#>
  //                   PREFIX bot: <https://w3id.org/bot#>
  //                   PREFIX dbo: <http://dbpedia.org/ontology/>
  //                   PREFIX dce: <http://purl.org/dc/elements/1.1/>
  //                   PREFIX dc: <http://purl.org/dc/terms/>
  //                   PREFIX owl: <http://www.w3.org/2002/07/owl#>
  //                   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  //                   PREFIX xml: <http://www.w3.org/XML/1998/namespace>
  //                   PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  //                   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  //                   PREFIX vann: <http://purl.org/vocab/vann/>
  //                   PREFIX bot_test: <http://example.org/bot_test#>

  //                   SELECT ?sub ?element
  //                   WHERE {
  //                          ?sub rdf:type bot:Space.
  //                          ?sub bot:containsElement ?element.
  //                         }
  //                   `

  // const client = new StreamQuery({ endpointUrl })
  // // const stream = await client.query.select(query, { headers: ['Content-Type']['application/sparql-query'], operation: "postDirect" });
  // const stream = await client.query.select(query, {
  //   headers: { 'Content-Type': 'application/sparql-query' },
  //   operation: 'postDirect',
  // })

  // //@ts-ignore
  // stream.on('data', (row) => {
  //   console.log(row)
  //   console.log(row.height.value)
  // })

  // //@ts-ignore
  // stream.on('error', (err) => {
  //   console.error(err)
  // })

  // const res = await fetch(`https://.../data`)
  // const data = await res.json()

  // // Pass data to the page via props
  // return { props: { data } }
}

const handleClick = async () => {
  const endpointUrl = 'http://localhost:3030/test/query'

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

  console.log(stream)

  //@ts-ignore
  stream.on('data', (row) => {
    console.log(row)
    console.log(row.height.value)
  })

  //@ts-ignore
  stream.on('error', (err) => {
    console.error(err)
  })
}

export default function Panel() {
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
          style={{ width: '100px', height: '100px', backgroundColor: 'black' }}
          onClick={handleClick}
        ></button>
      </div>
    </div>
  )
}
