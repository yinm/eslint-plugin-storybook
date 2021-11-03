/**
 * @fileoverview No title property in meta
 * @author Yann Braga
 */
'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'docsUrl'.
const { docsUrl } = require('../utils')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CATEGORY_I... Remove this comment to see the full error message
const { CATEGORY_ID } = require('../utils/constants')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      // @TODO check about this, as this only works in Typescript if the title property is optional, likely part of 6.4 typings
      description: 'Do not define a title in meta',
      category: CATEGORY_ID.CSF_STRICT,
      recommended: false,
      recommendedConfig: 'error',
      url: docsUrl('no-title-property-in-meta'), // URL to the documentation page for this rule
    },
    messages: {
      removeTitleInMeta: 'Do not define a title in meta',
      noTitleInMeta: `CSF3 does not need a title in meta`,
    },
  },
  create: function (context: any) {
    return {
      ExportDefaultDeclaration: function (node: any) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties =
          node.declaration.properties ||
          (node.declaration.expression && node.declaration.expression.properties)

        if (!metaProperties) {
          return
        }

        const titleNode = metaProperties.find((prop: any) => prop.key.name === 'title')

        if (titleNode) {
          context.report({
            node,
            messageId: 'noTitleInMeta',
            // In case we want this to be auto fixed by --fix
            // fix: function (fixer) {
            //   return fixer.remove(
            //     titleNode
            //   )
            // },
            suggest: [
              {
                messageId: 'removeTitleInMeta',
                fix: function (fixer: any) {
                  // @TODO this suggestion keeps the comma and might result in error:
                  // e.g. { title, args } becomes { , args }
                  return fixer.remove(titleNode)
                },
              },
            ],
          })
        }
      },
    };
  },
}
