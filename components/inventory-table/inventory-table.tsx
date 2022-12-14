/* eslint-disable-next-line */
export interface InventoryTableProps {
  data:any,
  page:string
}

export function InventoryTable(props: InventoryTableProps) {

  if(props.page != "home")
  {
    return (
      <div className="w-full ">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-center text-primary/50">
                <th>#ID</th>
                <th>ProduceType</th>
                <th>Name</th>
                <th>Imported Day</th>
                <th>Expiry Date Day</th>
                <th>produceStatus</th>
              </tr>
            </thead>
            <tbody>
              {props.data.map(
                ({ id,ProduceType, Name, expireDate, produceStatus, createdAt }) => {
                  return (
                    <tr key={id} className="text-sm text-center">
                      <th>{id}</th>
                      <td>{ProduceType}</td>
                      <td>{Name}</td>
                      <td>{createdAt}</td>
                      <td>{expireDate}</td>
                      <td className="flex justify-center">
                        <span
                          className={`py-2 px-4 rounded-full ${
                            produceStatus === 'good'
                              ? 'bg-success/20 text-green-800'
                              : produceStatus === 'about to expire'
                              ? 'bg-warning/20 text-orange-700'
                              : produceStatus === 'expired'
                              ? 'bg-error/20 text-rose-700'
                              : ''
                          }`}
                        >
                          {produceStatus}
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  else
  {
    return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-center text-white ">
                <th className="bg-primary/90">#ID</th>
                <th className="bg-primary/90">Name</th>
                <th className="bg-primary/90">State</th>
              </tr>
            </thead>
            <tbody>
              {props.data.map(
                ({ id,Name,produceStatus}) => {
                  return (
                    <tr key={id} className="text-sm text-center">
                      <th>{id}</th>
                      <td>{Name}</td>
                      <td className="flex justify-center">
                        <span
                          className={`py-2 px-4 rounded-full ${
                            produceStatus === 'good'
                              ? 'bg-success/20 text-green-800'
                              : produceStatus === 'about to expire'
                              ? 'bg-warning/20 text-orange-700'
                              : produceStatus === 'expired'
                              ? 'bg-error/20 text-rose-700'
                              : ''
                          }`}
                        >
                          {produceStatus}
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default InventoryTable;
