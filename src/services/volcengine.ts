import { AnalysisResult } from "../types";

export async function analyzeRoom(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const ARK_API_KEY = "ark-16c47fa8-4a16-4468-b92e-bb209644d9e5-128ee";
  const ENDPOINT_ID = "ep-20260507003748-ncm7h"; 
  
  const prompt = `请分析这张房间照片。你的任务是提供一套“不搬动大件家具”的收纳整理方案。
          重点识别：具体的杂物（如地上的衣服、乱放的杯子、缠绕的电线）、该丢弃的垃圾、可以优化的桌面布局。
          
          请通过 JSON 格式回复，结构如下：
          {
            "roomType": "例如：杂乱的卧室、拥挤的客厅",
            "problems": [" identified_items: 如 '书桌上的空饮料瓶', '床尾堆放的脏衣服'"],
            "organizationSuggestions": [
              { "title": "具体收纳位置", "description": "告诉用户把上述杂物放进哪个柜子、抽屉或收纳盒中。" }
            ],
            "declutteringTips": ["一项目标明确的断舍离建议，例如：扔掉过期的杂志"],
            "rearrangementPlan": "描述如何通过整理小物件（而非搬动大床/沙发）来让空间显得通透。",
            "imageAlt": "图像详细描述"
          }`;

  const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ARK_API_KEY}`
    },
    body: JSON.stringify({
      model: ENDPOINT_ID,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
      const err = await response.text();
      throw new Error(`Volcengine Vision API Error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const jsonStr = data.choices[0].message.content.trim();
  return JSON.parse(jsonStr) as AnalysisResult;
}

export async function generateOrganizedImage(originalImage: string, result: AnalysisResult): Promise<string> {
    const ARK_API_KEY = "ark-16c47fa8-4a16-4468-b92e-bb209644d9e5-128ee";
    const prompt = `这是一张需要整理的房间照片。请生成一张整理完成后的精细化效果图，作为用户的收纳指南。
            
            严格要求：
            1. 布局零改变：必须保持原图中所有大件家具（如床、沙发、柜子、桌椅）、墙壁、地板、窗户的款式、颜色和位置与原图100%一致。
            2. 杂物规整而非消失：不要把所有东西都变没！请将图中散乱的小物品（${result.problems.join("、")}）整齐地摆放在桌面上、架子上或收纳盒中，看起来井井有条。
            3. 垃圾断舍离：识别并移除所有明显的垃圾、废纸。乱放的衣物请折叠整齐放在床上或椅子上。
            4. 真实感还原：整理后的房间应该看起来有人居住但非常整洁，保留生活气息，而不是空无一物的样板间。
            5. 去人化：确保图中没有任何人物。`;

    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ARK_API_KEY}`
        },
        body: JSON.stringify({
            model: "ep-20260507005454-m8j59",
            prompt: prompt,
            image: originalImage,
            size: "2K",
            response_format: "b64_json",
            watermark: false
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Volcengine API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (data.data && data.data.length > 0 && data.data[0].b64_json) {
        return `data:image/jpeg;base64,${data.data[0].b64_json}`;
    }
    
    throw new Error("未能生成图像");
}
