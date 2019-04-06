import { SecretsManager } from "aws-sdk"

class AWSSecretManager {
  public async resolve(name: string, region: string): Promise<any> {
    const secretsManager = new SecretsManager({ region })

    const result = await secretsManager.getSecretValue({ SecretId: name }).promise()

    if (result instanceof Error) {
      throw result
    }

    let resolvedSecret: string = ""

    if (result.SecretString !== undefined) {
      resolvedSecret = result.SecretString
    } else if (result.SecretBinary !== undefined) {
      const buff = new Buffer(result.SecretBinary.toString("ascii"), "base64")
      resolved_secret = buff.toString("ascii")
    } else {
      throw new Error("Unable to resolve secret.")
    }

    try {
      return JSON.parse(resolved_secret)
    } catch (e) {
      throw e
    }

    throw new Error("Somethign unexpected happened.")
  }
}

export { AWSSecretManager }
