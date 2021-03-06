import { SecretsManager } from "aws-sdk"

class AWSSecretManager {
  public static async resolve(args: { name: string; region: string }): Promise<any> {
    const secretsManager = new SecretsManager({
      region: args.region,
    })

    const result = await secretsManager.getSecretValue({ SecretId: args.name }).promise()

    if (result instanceof Error) {
      throw result
    }

    let resolvedSecret: string = ""

    if (result.SecretString !== undefined) {
      resolvedSecret = result.SecretString
    } else if (result.SecretBinary !== undefined) {
      const buff = new Buffer(result.SecretBinary.toString("ascii"), "base64")
      resolvedSecret = buff.toString("ascii")
    } else {
      throw new Error("Unable to resolve secret.")
    }

    try {
      return JSON.parse(resolvedSecret)
    } catch (e) {
      throw e
    }

    throw new Error("Something unexpected happened.")
  }
}

export { AWSSecretManager }
