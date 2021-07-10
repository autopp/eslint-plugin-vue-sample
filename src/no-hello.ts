/**
 * Copyright (C) 2021 Akira Tanimura (@autopp)
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import { Rule } from "eslint"
import { Literal, TemplateElement } from "estree"
import { AST } from "vue-eslint-parser"

interface VueEslintParserServices {
  defineTemplateBodyVisitor(
    templateBodyVisitor: { [key: string]: (...args: any) => void },
    scriptVisitor?: { [key: string]: (...args: any) => void },
    options?: { templateBodyTriggerSelector: "Program" | "Program:exit" },
  ): Rule.RuleListener
}

export const noHello: Rule.RuleModule = {
  meta: {
    type: "problem",
  },
  create(context: Rule.RuleContext) {
    const jsListener =  {
      Literal(node: Literal & Rule.NodeParentExtension) {
        if (node.value === "hello") {
          context.report({ node, message: '"hello" is not allowed' })
        }
      },
      TemplateElement(node: TemplateElement & Rule.NodeParentExtension) {

        if (node.value.cooked === "hello") {
          context.report({ node, message: '"hello" is not allowed' })
        }
      },
    }

    if (typeof context.parserServices?.defineTemplateBodyVisitor !== "function") {
      return jsListener
    }

    const parserServices = context.parserServices as VueEslintParserServices
    return parserServices.defineTemplateBodyVisitor(
      {
        VText(node: AST.VText) {
          if (node.value === "hello") {
            context.report({ loc: node.loc, message: '"hello" is not allowed' })
          }
        },
        VLiteral(node: AST.VLiteral) {
          if (node.value === "hello") {
            context.report({ loc: node.loc, message: '"hello" is not allowed' })
          }
        },
        ...jsListener
      },
      jsListener
    )
  }
}
