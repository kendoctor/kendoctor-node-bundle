<?php

namespace Kendoctor\Bundle\NodeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\SecurityContext;

class DefaultController extends Controller {

    /**
     * @Route("/", name="homepage")
     * @Template()
     */
    public function indexAction() {
        $em = $this->getDoctrine()->getManager();

        $name = "kendoctor";
        $node = new \Kendoctor\Bundle\NodeBundle\Entity\Node();
        $node->setName($name);
        $em->persist($node);

        $node = new \Kendoctor\Bundle\NodeBundle\Entity\ContentNode();
        $node->setName($name);

        $em->persist($node);
        $em->flush();

        //   $securityContext = $this->get('security.context');
        //  $a = new Symfony\Component\Security\Core\SecurityContext();
        return array('name' => $name);
    }

}
