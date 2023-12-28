/**
 * @fileoverview A story should not have an empty args property
 * @author yinm
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import rule from '../../../lib/rules/no-empty-args'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-empty-args', rule, {
  /**
   * 👉 Please read this and delete this entire comment block.
   * This is an example test for a rule that reports an error in case a named export is called 'wrong'
   * Use https://eslint.org/docs/developer-guide/working-with-rules for Eslint API reference
   */
  valid: [
    "export const PrimaryButton = { args: {foo: 'bar'} }",
    "export const PrimaryButton: Story = { args: {foo: 'bar'} }",
    `
      const Default = {}
      export const PrimaryButton = { ...Default, args: {foo: 'bar'} }
    `,
  ],
  invalid: [
    {
      code: 'export const PrimaryButton = { args: {} }',
      errors: [
        {
          messageId: 'detectEmptyArgs',
          type: AST_NODE_TYPES.Property,
          suggestions: [
            {
              messageId: 'removeEmptyArgs',
              output: 'export const PrimaryButton = {  }',
            },
          ],
        },
      ],
    },
  ],
})
