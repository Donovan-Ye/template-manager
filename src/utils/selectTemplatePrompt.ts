import prompts from 'prompts'
import { getTemplateFile } from './git'
import type { Template } from '../types/templates'
import type { TemplateOptions } from './git'

export async function selectTemplatePrompt(options: TemplateOptions = {}): Promise<Template> {
  const templates = await getTemplateFile(options)

  const { template }: { template: Template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Choose a template to open.',
    choices: templates.map(template => ({
      title: template.name,
      description: template.path,
      value: template,
    })),
    initial: 0,
  })

  return template
}
