import { formatEventBody } from "@modaoperandi2/serverless-utilities"
import { Firehose } from "aws-sdk"

interface IConstructorArgs {
  region?: string
}

class KinesisManager {
  protected _region: string = "us-east-1"
  protected _firehose: any = {}

  get region() {
    return this._region
  }

  set region(region_name: string) {
    this._region = region_name
  }

  get firehose() {
    return this._firehose
  }

  set firehose(instance: any) {
    this._firehose = instance
  }

  constructor(args: IConstructorArgs = {}) {
    if (args.region !== undefined) {
      this.region = args.region
    }
    this.instantiateFirehose()
  }

  public push = async (record: any, delivery_stream_name: string): Promise<boolean> => {
    const input: Firehose.Types.PutRecordInput = {
      DeliveryStreamName: delivery_stream_name,
      Record: {
        Data: formatEventBody(record),
      },
    }

    const result = await this._firehose.putRecord(input).promise()

    if (result instanceof Error) {
      throw result
    }

    return true
  }

  private instantiateFirehose = () => {
    this.firehose = new Firehose({
      region: this.region,
      apiVersion: "2015-08-04",
    })
  }
}

export { KinesisManager }
