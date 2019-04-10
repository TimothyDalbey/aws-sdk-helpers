import { DocumentClient } from "aws-sdk/clients/dynamodb"

interface IConstructorArgs {
  table_name: string
  region?: string
}

class DynamoDBManager {

  protected readonly _default_argumentation = {}

  private _dc: any
  private _table_name: string
  private document_client_arguments: string[] = ["region"]

  get default_argumentation() {
    return this._default_argumentation
  }

  constructor(args: IConstructorArgs) {
    const { table_name } = args
    this._table_name = table_name

    this.setDocumentClient(args)
  }

  public setDocumentClient = (args: IConstructorArgs) => {
    const argumentation = Object.assign({}, args)

    Object.keys(argumentation).map(key => {
      if (this.document_client_arguments.indexOf(key) === -1) {
        delete (argumentation as any)[key]
      }
    })

    this._dc = new DocumentClient(Object.assign(this.default_argumentation, argumentation))
  }

  // Technical Debt:  These "any" types need to be replaced with appropriate Interfaces
  public query = async (parameters: any): Promise<DocumentClient.QueryOutput> => {
    this.addTableName(parameters)

    const result: DocumentClient.QueryOutput = await this.queryDynamoDB(parameters)

    if (result instanceof Error) {
      throw Error
    }

    return result
  }

  public delete = async (parameters: any): Promise<boolean> => {
    this.addTableName(parameters)

    const result: DocumentClient.DeleteItemOutput = await this.deleteDynamoDB(parameters)

    if (result instanceof Error) {
      throw Error
    }

    return true
  }

  public get = async (parameters: any): Promise<null | any> => {
    this.addTableName(parameters)

    const result: DocumentClient.GetItemOutput = await this.getDynamoDB(parameters)

    if (result instanceof Error) {
      throw Error
    }

    if (result.Item === undefined) {
      return null
    }

    return result.Item
  }

  public put = async (parameters: any): Promise<DocumentClient.PutItemOutput> => {
    this.addTableName(parameters)

    parameters.Item = this.sanitizeForStorage(parameters.Item)

    const result: DocumentClient.PutItemOutput = await this.putDynamoDB(parameters)

    if (result instanceof Error) {
      throw Error
    }

    return result
  }

  // Technical Debt:  Replace output any with appropriate type
  public batchDelete = async (items: any[], keys: { hash: string; range: string }): Promise<any> => {
    const parameters = {
      RequestItems: {
        [this._table_name]: items.map(item => {
          return {
            DeleteRequest: {
              Key: {
                [keys.hash]: item[keys.hash],
                [keys.range]: item[keys.range],
              },
            },
          }
        }),
      },
    }

    return await this.batchWriteDynamoDB(parameters)
  }

  // Technical Debt:  This should be a private method
  public sanitizeForStorage = (object: any): any => {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach(
        k =>
          (obj[k] && typeof obj[k] === "object" && removeEmpty(obj[k])) ||
          (!obj[k] && obj[k] !== undefined && delete obj[k]),
      )
      return obj
    }

    return removeEmpty(object)
  }

  private addTableName = (object: any): void => {
    object.TableName = this._table_name
  }

  // Technical Debt:  Replace input/output any with appropriate type
  // tslint:disable-next-line:max-line-length
  private batchWriteDynamoDB = async (parameters: any): Promise<any> => {
    return await this._dc.batchWrite(parameters).promise()
  }

  private queryDynamoDB = async (parameters: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> => {
    return await this._dc.query(parameters).promise()
  }

  // tslint:disable-next-line:max-line-length
  private deleteDynamoDB = async (
    parameters: DocumentClient.DeleteItemInput,
  ): Promise<DocumentClient.DeleteItemOutput> => {
    return await this._dc.delete(parameters).promise()
  }

  private getDynamoDB = async (parameters: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> => {
    return await this._dc.get(parameters).promise()
  }

  private putDynamoDB = async (parameters: DocumentClient.Put): Promise<DocumentClient.PutItemOutput> => {
    return await this._dc.put(parameters).promise()
  }
}

export { DynamoDBManager }
