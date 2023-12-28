/**
 * @fileoverview A story should not have an empty args property
 * @author yinm
 */

import { TSESTree } from '@typescript-eslint/utils'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isIdentifier,
  isObjectExpression,
  isProperty,
  isSpreadElement,
  isVariableDeclaration,
} from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'no-empty-args',
  defaultOptions: [],
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'A story should not have an empty args property',
      // Add the categories that suit this rule.
      categories: [CategoryId.RECOMMENDED],
      recommended: 'warn', // `warn` or `error`
    },
    messages: {
      detectEmptyArgs: 'Empty args should be removed as it is meaningless',
      removeEmptyArgs: 'Remove empty args',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [], // Add a schema if the rule has options. Otherwise remove this
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // CSF3
      ExportNamedDeclaration: function (node: TSESTree.ExportNamedDeclaration) {
        const declaration = node.declaration
        // if (!declaration) return
        if (!isVariableDeclaration(declaration)) return

        const init = declaration.declarations[0]?.init
        if (!isObjectExpression(init)) return

        const argsNode = init.properties.find(
          (prop) => isProperty(prop) && isIdentifier(prop.key) && prop.key.name === 'args'
        )
        if (typeof argsNode === 'undefined') return

        if (
          !isSpreadElement(argsNode) &&
          isObjectExpression(argsNode.value) &&
          argsNode.value.properties.length === 0
        ) {
          context.report({
            node: argsNode,
            messageId: 'detectEmptyArgs',
            suggest: [
              {
                messageId: 'removeEmptyArgs',
                fix(fixer) {
                  return fixer.remove(argsNode)
                },
              },
            ],
          })
        }
      },
    }
  },
})
