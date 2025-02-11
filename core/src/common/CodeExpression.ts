export class CodeExpression {
  code: string
  isFunction: boolean = false
  args: any
  constructor(
    code: string,
    args: any | Array<any>,
    isFunction: boolean = false
  ) {
    this.code = code
    this.args = args
    this.isFunction = isFunction
  }
  run(...values: Array<any>) {
    let code = this.code
    if (code) {
      if (!this.isFunction) {
        code = code.trim()
        if (code.indexOf('return ') >= 0) {
          code = `(${this.args.join()}) => { ${code} }`
        } else {
          code = `(${this.args.join()}) => { return ${code} }`
        }
      }
      try {
        return new Function('return ' + code)().apply(null, values)
      } catch (e) {
        console.error('run code ' + code, e)
      }
    } else {
      return null
    }
  }

  public static runCode(
    code: string,
    args: any | Array<any> = [],
    ...values: Array<any>
  ) {
    let ce = new CodeExpression(code, args)
    return ce.run(...values)
  }

  public static runCodes(
    codes: Array<string>,
    args: any | Array<any> = [],
    ...values: Array<any>
  ) {
    let results: Array<any> = []
    for (let code of codes) {
      let ce = new CodeExpression(code, args)
      results.push(ce.run(...values))
    }
    return results
  }
}
