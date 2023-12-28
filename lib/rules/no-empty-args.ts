/**
 * @fileoverview A story should not have an empty args property
 * @author yinm
 */

import { TSESTree } from '@typescript-eslint/utils'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isIdentifier,
  isMetaProperty,
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
    type: 'suggestion',
    docs: {
      description: 'A story should not have an empty args property',
      categories: [CategoryId.RECOMMENDED, CategoryId.CSF],
      recommended: 'error',
    },
    messages: {
      detectEmptyArgs: 'Empty args should be removed as it is meaningless',
      removeEmptyArgs: 'Remove empty args',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
  },

  create(context) {
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
      // CSF2
      AssignmentExpression(node) {
        const { left, right } = node

        if (
          'property' in left &&
          isIdentifier(left.property) &&
          !isMetaProperty(left) &&
          left.property.name === 'args'
        ) {
          if (
            !isSpreadElement(right) &&
            isObjectExpression(right) &&
            right.properties.length === 0
          ) {
            context.report({
              node,
              messageId: 'detectEmptyArgs',
              suggest: [
                {
                  messageId: 'removeEmptyArgs',
                  fix(fixer) {
                    return fixer.remove(node)
                  },
                },
              ],
            })
          }
        }
      },
    }
  },
})
