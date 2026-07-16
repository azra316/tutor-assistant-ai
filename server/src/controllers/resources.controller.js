import {
  deleteUserResource,
  duplicateUserResource,
  getUserResourceById,
  listUserResources,
  updateUserResource,
} from "../services/generatedResource.service.js";

export async function listResources(request, response, next) {
  try {
    const data = await listUserResources(request.user._id, request.query);
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getResource(request, response, next) {
  try {
    const data = await getUserResourceById(request.user._id, request.params.id);
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateResource(request, response, next) {
  try {
    const data = await updateUserResource(request.user._id, request.params.id, request.body);
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteResource(request, response, next) {
  try {
    await deleteUserResource(request.user._id, request.params.id);
    response.status(200).json({ success: true, message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
}

export async function duplicateResource(request, response, next) {
  try {
    const data = await duplicateUserResource(request.user._id, request.params.id);
    response.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
