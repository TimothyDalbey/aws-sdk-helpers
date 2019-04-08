import * as AWS from "aws-sdk"

const getS3FileContents = async (bucket: string, key: string, region: string = "us-east-1"): Promise<any> => {
  const S3 = new AWS.S3({
    apiVersion: "2006-03-01",
    region,
  })

  const parameters = {
    Bucket: bucket,
    Key: key,
  }

  const object = await S3.getObject(parameters).promise()

  if (object.Body !== undefined && object.Body instanceof Buffer) {
    return object.Body.toString("utf-8")
  }

  throw new Error("Object did not have a body field.")
}

export { getS3FileContents }
