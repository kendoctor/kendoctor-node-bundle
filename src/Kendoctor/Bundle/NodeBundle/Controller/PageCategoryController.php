<?php

namespace Kendoctor\Bundle\NodeBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Kendoctor\Bundle\NodeBundle\Entity\PageCategory;
use Kendoctor\Bundle\NodeBundle\Form\PageCategoryType;

/**
 * PageCategory controller.
 *
 * @Route("/pagecategory")
 */
class PageCategoryController extends Controller
{
    /**
     * Lists all PageCategory entities.
     *
     * @Route("/", name="pagecategory")
     * @Method("GET")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('KendoctorNodeBundle:PageCategory')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new PageCategory entity.
     *
     * @Route("/", name="pagecategory_create")
     * @Method("POST")
     * @Template("KendoctorNodeBundle:PageCategory:new.html.twig")
     */
    public function createAction(Request $request)
    {
        $entity  = new PageCategory();
        $form = $this->createForm(new PageCategoryType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('pagecategory_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Displays a form to create a new PageCategory entity.
     *
     * @Route("/new", name="pagecategory_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction()
    {
        $entity = new PageCategory();
        $form   = $this->createForm(new PageCategoryType(), $entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Finds and displays a PageCategory entity.
     *
     * @Route("/{id}", name="pagecategory_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('KendoctorNodeBundle:PageCategory')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find PageCategory entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing PageCategory entity.
     *
     * @Route("/{id}/edit", name="pagecategory_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('KendoctorNodeBundle:PageCategory')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find PageCategory entity.');
        }

        $editForm = $this->createForm(new PageCategoryType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing PageCategory entity.
     *
     * @Route("/{id}", name="pagecategory_update")
     * @Method("PUT")
     * @Template("KendoctorNodeBundle:PageCategory:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('KendoctorNodeBundle:PageCategory')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find PageCategory entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new PageCategoryType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('pagecategory_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a PageCategory entity.
     *
     * @Route("/{id}", name="pagecategory_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('KendoctorNodeBundle:PageCategory')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find PageCategory entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('pagecategory'));
    }

    /**
     * Creates a form to delete a PageCategory entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
