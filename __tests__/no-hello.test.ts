import { noHello } from "../src/no-hello"
import { RuleTester } from "eslint"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015
  }
})

const vueEslintParserPath = require.resolve('vue-eslint-parser')
const errors = [{ message: '"hello" is not allowed' }]

ruleTester.run("no-hello", noHello, {
  valid: [
    { code: 'const x = 42' },
    { code: 'const x = 42', parser: vueEslintParserPath },
    { code: '<script>const x = 42</script>', parser: vueEslintParserPath },
    { code: '<template>{{ 42 }}</template>', parser: vueEslintParserPath },
    { code: '<template><Answer value="42" /></template>', parser: vueEslintParserPath },
    { code: '<template><div>42</div></template>', parser: vueEslintParserPath },
  ],
  invalid: [
    { code: 'const x = "hello"', errors },
    { code: 'const x = "hello"', parser: vueEslintParserPath, errors },
    { code: '<script>const x = "hello"</script>', parser: vueEslintParserPath, errors },
    { code: '<template>{{ "hello" }}</template>', parser: vueEslintParserPath, errors },
    { code: '<template><Answer value="hello" /></template>', parser: vueEslintParserPath, errors },
    { code: '<template><div>hello</div></template>', parser: vueEslintParserPath, errors },
  ]
})
