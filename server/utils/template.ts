import ejs from "ejs"

//

type TemplateType = "VERIFICATION" | "VERIFICATION-SUCCESS" | "RESET-PASSWORD" | "RESET-PASSWORD-SUCCESS"
type SafeRenderTemplateResult =
    { data: string, error?: undefined, success: true }
    | { data?: undefined, error: Error, success: false }

//

const renderTemplate = async (template: TemplateType, data: ejs.Data) => {
    const filepath = `./server/templates/${template.toLowerCase()}.ejs`
    return await ejs.renderFile(filepath, data)
}

const safeRenderTemplate = async (template: TemplateType, data: ejs.Data): Promise<SafeRenderTemplateResult> => {
    const filepath = `./server/templates/${template.toLowerCase()}.ejs`
    const result = {
        data: undefined as string | undefined,
        error: undefined as Error | undefined,
        success: false
    }
    
    await ejs.renderFile(filepath, data)
        .then(str => result.data = str)
        .then(() => result.success = true)
        .catch(err => result.error = err as Error)
    
    return result as SafeRenderTemplateResult;
}

//

export {
    type TemplateType,
    type SafeRenderTemplateResult,
    ejs,
    renderTemplate,
    safeRenderTemplate,
}